import {Node} from "./Node.js";
import {Algorithm, finishedStatus} from "./Algorithm.js";

/**
 * An implementation of the A* path-finding algorithm.
 */
class AStar extends Algorithm {

    /**
     *
     * @param grid - a Grid object which will be mutated by the algorithm
     * @param heuristic - is a function(Node,Node) -> Number,  that will be used as the A*'s h(n) (heuristic) function.
     * This will default to the euclidean Distance between two nodes if no function is passed.
     */
    constructor(grid, heuristic) {
        super(grid);
        this.heuristic = heuristic ? heuristic : Node.euclidianDistance;
        this.algorithmName = 'A*';
    }



    /**
     * performs a single tick in the A* search algorithm.
     * When the tick is complete, this.currentNode will contain the node with the lowest cost path.
     * You can manually call Node.buildCurrentPath(currentNode) to obtain the list of nodes in the path
     * from currentNode to startNode.
     * @returns a Node object that is the last node in the path with the lowest f-score. If the algorithm is finished
     * or a path to goal could NOT be found, `undefined` is returned
     */
    tick() {
        if (!this.finished) {
            if (this.openSet.length > 0) {
                // current is node having the lowest fScore in openSet,
                // sort openSet so lowest f-score is at end of the array, then pop it off the end
                const current = this.openSet.sort((n1, n2) => n2.f - n1.f).pop();
                this.currentNode = current;
                if (current.equals(this.grid.goalNode)) {
                    // end node reached, return current which will be the goalNode and contain links to the path taken
                    this.finished = true;
                    this.setFinishedStatus( finishedStatus.PATH_FOUND );
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

                    if (!this.grid.isObstacleNode(current.row, current.col)) {
                        if (tempGScore < neighbor.g) {
                            // this path to neighbor is the best so far, record it
                            neighbor.cameFrom = current;
                            neighbor.g = tempGScore;
                            neighbor.f = neighbor.g + this.heuristic(neighbor, this.grid.goalNode);

                            // if neighbor not in openSet, then add it
                            if (!this.openSet.find(node => node.equals(neighbor))) {
                                this.openSet.push(neighbor);
                            }
                        }
                    }

                }

            } else {
                // goal can not be reached, no solution exists
                this.finished = true;
                this.setFinishedStatus( finishedStatus.PATH_NOT_FOUND );
            }
        }
    }

    /**
     * Runs the A* algorithm until completion.
     * At each iteration of its main loop, A* needs to determine which of its paths to extend. It does so based on the
     * cost of the path and an estimate of the cost required to extend the path all the way to the goal.
     * Specifically, A* selects the path that minimizes: f(n) = g(n) + h(n)
     *   where n is the next node on the path
     *   g(n) is the cost of the path from the start node to n
     *   h(n) is a heuristic function that estimates the cost of the cheapest path from n to the goal node
     * @param heuristic - the heuristic function: h(n1, n2) estimates the cost to reach node n2 from node n1.
     * @returns if a path to the goal node was found, then the last node in the lowest cost path will be returned. If
     * no path was found, then null is returned
     */
    run(heuristic = Node.euclidianDistance) {

        // The list of discovered nodes that need to be evaluated.
        const openSet = [this.grid.startNode];

        // closed set contains nodes that have already been evaluated
        const closedSet = [];

        while (openSet.length > 0) {

            // current is node having the lowest fScore in openSet,
            // sort openSet so lowest f-score is at end of the array, then pop it off the end
            const current = openSet.sort((n1, n2) => n2.f - n1.f).pop();
            this.openSet = openSet;
            this.currentNode = current;

            if (current.equals(this.grid.goalNode)) {
                this.finished = true;
                return current;
            }
            current.visited = true;
            closedSet.push(current);

            for (const neighbor of this.grid.neighbors( current.row, current.col ) ) {
                // don't examine neighbors that are already in the closedSet
                if (closedSet.find(node => node.equals(neighbor))) {
                    continue;
                }
                // tempGScore is the sum of all node weights from start to the neighbor through current
                const tempGScore = current.g + current.weightToNode(neighbor);

                // we can't pass through obstacle nodes
                if (!this.grid.isObstacleNode(current.row, current.col)) {
                    if (tempGScore < neighbor.g) {
                        // this path to neighbor is the best so far, record it
                        neighbor.cameFrom = current;
                        neighbor.g = tempGScore;
                        neighbor.f = neighbor.g + heuristic(neighbor, this.grid.goalNode);

                        // if neighbor not in openSet, then add it
                        if (!openSet.find(node => node.equals(neighbor))) {
                            openSet.push(neighbor);
                        }
                    }
                }

            }

        }
        // goal never reached, return null
        this.finished = true;
        return null;
    }
}

export {AStar};