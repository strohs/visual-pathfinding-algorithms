import {Algorithm, finishedStatus} from "./Algorithm.js";

export {Dijkstra};



/**
 * Implementation of Dijkstra's algorithm using an array to store nodes.
 * Methods are provides that can 'tick' through each iteration of the as well as a method to fully run the algorithm
 * to completion
 *
 * grid - is a Grid object which will be manipulated by the algorithm
 */
class Dijkstra extends Algorithm {

    constructor(grid) {
        super(grid);
        this.algorithmName = 'Dijkstra';
    }


    /**
     * performs a single tick of the algorithm. When the tick is complete, this.currentNode will
     * contain the node with the lowest cost path.
     * @returns the 'current Node' which is the last node in the path with the lowest f-score, else 'undefined' if
     * the algorithm has finished exploring all paths
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
                    // tempGScore is the euclidian distance from start to the neighbor through current
                    const tempGScore = current.g + current.weightToNode(neighbor);

                    if (!this.grid.isObstacleNode(current.row, current.col)) {
                        if (tempGScore < neighbor.g) {
                            // this path to neighbor is the best so far, record it
                            neighbor.cameFrom = current;
                            neighbor.g = tempGScore;
                            neighbor.f = neighbor.g;
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
     * Runs Dijkstra's algorithm to completion
     * At each iteration of its main loop, Dijkstra needs to determine which of its paths to extend. It does so based on the
     * cost of the path and an estimate of the cost required to extend the path all the way to the goal.
     * Specifically, Dijkstra selects the path that minimizes: f(n) = g(n)
     *   where n is the next node on the path
     *   g(n) is the cost of the path from the start node to n
     * @returns if a path to the goal node was found, then the last node in the lowest cost path will be returned. If
     * the goal node could not be reached, then null is returned
     */
    run() {
        // The list of discovered nodes that need to be evaluated.
        const openSet = [this.grid.startNode];

        // closed set contains nodes that have already been visited
        const closedSet = [];

        while (openSet.length > 0) {

            // current is node having the lowest fScore in openSet,
            // sort openSet so lowest f-score is at end of the array, then pop it off the end
            const current = openSet.sort((n1, n2) => n2.f - n1.f).pop();
            this.openSet = openSet;
            this.currentNode = current;

            if (current.equals(this.grid.goalNode)) {
                return current;
            }
            closedSet.push(current);

            for (const neighbor of this.grid.neighbors( current.row, current.col ) ) {
                // don't examine neighbors that are already in the closedSet
                if (closedSet.find(node => node.equals(neighbor))) {
                    continue;
                }
                // tempGScore is the distance from start to the neighbor through current
                const tempGScore = current.g + current.weightToNode(neighbor);

                if (!this.grid.isObstacleNode(current.row, current.col)) {
                    if (tempGScore < neighbor.g) {
                        // this path to neighbor is the best so far, record it
                        neighbor.cameFrom = current;
                        neighbor.g = tempGScore;
                        neighbor.f = neighbor.g;
                        // if neighbor not in openSet, then add it
                        if (!openSet.find(node => node.equals(neighbor))) {
                            openSet.push(neighbor);
                        }
                    }
                }

            }
        }
        // goal never reached, return null
        return null;
    }
}