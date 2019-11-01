import {Node} from "./node.js";
import {Algorithm} from "./algorithm.js";
import {FibonacciHeap} from "./fibonacciHeap.js";

export {DijkstraFiboHeap};



/**
 * TODO fibonacci heap implementation is slow, need to investigate this
 * Implementation of Dijkstra's algorithm, using a Fibonacci Heap
 * to store nodes by minimum f(n) score for better performance. Methods
 * are provides that can 'tick' through each iteration of the as well as a method to fully run the algorithm
 * to completion
 *
 * grid - is a Grid object which will be manipulated by the algorithm
 */
class DijkstraFiboHeap extends Algorithm {

    constructor(grid) {
        super(grid);
        this.heap = new FibonacciHeap(undefined);
    }

    /**
     * resets Node function values and algorithm variables to their initial values, so that the search can be
     * run again. This method does not resetState OBSTACLE_NODES or start/end nodes
     */
    resetState() {
        super.resetState();
        this.heap.clear();
        this.heap.insert( this.grid.startNode.f, this.grid.startNode);
    }

    /**
     * performs a single tick of the algorithm. When the tick is complete, this.currentNode will
     * contain the last node of the lowest cost path.  To reconstruct the list of nodes in the complete path
     * you must call Node.buildCurrentPath() and pass it the current node
     * @returns a Node object that is the last node in the path with the lowest f-score
     */
    tick() {
        if (!this.finished) {
            if (this.openSet.length > 0) {
                // current is node having the lowest fScore in openSet,
                // use a Fibonacci Heap to store and sort the nodes by lowest F(n) score
                const current = this.heap.extractMinimum().value;
                this.currentNode = current;
                if (current.equals(this.grid.endNode)) {
                    // end node reached, return current which will be the endNode and contain links to the path taken
                    this.finished = true;
                    this.finishStatus = 'PATH_FOUND';
                    return current;
                }

                current.visited = true;
                this.closedSet.push(current);

                for (const neighbor of this.grid.neighbors( current.row, current.col ) ) {
                    // don't examine neighbors that are already in the closedSet
                    if (this.closedSet.find(node => node.equals(neighbor))) {
                        continue;
                    }
                    // tempGScore is the euclidianDistance from start to the neighbor through current
                    const tempGScore = current.g + current.weightToNode(neighbor);
                    if (tempGScore < neighbor.g) {
                        // this path to neighbor is the best so far, record it
                        neighbor.cameFrom = current;
                        neighbor.g = tempGScore;
                        neighbor.f = neighbor.g;
                        // if neighbor not in openSet, then add it
                        if (!this.openSet.find(node => node.equals(neighbor))) {
                            this.openSet.push(neighbor);
                            this.heap.insert( neighbor.f, neighbor);
                        }
                    }
                }

            } else {
                // goal can not be reached, no solution exists
                this.finished = true;
                this.finishStatus = 'NO_PATH_FOUND';
            }
        }
    }

    /**
     * Full implementation of the Dijkstra's algorithm, a best-first search
     * At each iteration of its main loop, Dijkstra needs to determine which of its paths to extend. It does so based on the
     * cost of the path and an estimate of the cost required to extend the path all the way to the goal.
     * Specifically, Dijkstra selects the path that minimizes: f(n) = g(n)
     *   where n is the next node on the path
     *   g(n) is the cost of the path from the start node to n
     * @returns if a path to the goal node was found, then the last node in the lowest cost path will be returned. If
     * no path was found, then null is returned
     */
    run() {
        // The list of discovered nodes that need to be evaluated.
        const openSet = [this.grid.startNode];

        // closed set contains nodes that have already been visited
        const closedSet = [];

        while (openSet.length > 0) {

            // current is node having the lowest fScore in openSet,
            // sort openSet so lowest f-score is at end of the array, then pop it off the end
            const current = this.heap.extractMinimum().value;
            this.openSet = openSet;
            this.currentNode = current;

            if (current.equals(this.grid.endNode)) {
                return current;
            }
            closedSet.push(current);

            for (const neighbor of this.grid.neighbors( current.row, current.col ) ) {
                // don't examine neighbors that are already in the closedSet
                if (closedSet.find(node => node.equals(neighbor))) {
                    continue;
                }
                // tempGScore is the euclidianDistance from start to the neighbor through current
                const tempGScore = current.g + current.weightToNode(neighbor);
                if (tempGScore < neighbor.g) {
                    // this path to neighbor is the best so far, record it
                    neighbor.cameFrom = current;
                    neighbor.g = tempGScore;
                    neighbor.f = neighbor.g;
                    // if neighbor not in openSet, then add it
                    if (!openSet.find(node => node.equals(neighbor))) {
                        this.heap.insert( neighbor.f, neighbor);
                        openSet.push(neighbor);
                    }
                }
            }
        }
        // goal never reached, return null
        return null;
    }
}