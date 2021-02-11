import {Algorithm, finishedStatus} from "./Algorithm.js";

export {BreadthFirstSearch};



/**
 * Implementation of Breadth First Search pathfinding algorithm.
 * This is essentially Dijkstra's algorithm, but node weights are not taken into account.
 * grid - a Grid object which will be mutated by the algorithm
 */
class BreadthFirstSearch extends Algorithm {

    /**
     *
     * @param grid
     */
    constructor(grid) {
        super(grid);
        this.algorithmName = 'Breadth First';
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
                const current = this.openSet.pop();
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
                    if (!this.grid.isObstacleNode(neighbor.row, neighbor.col)) {
                        neighbor.cameFrom = current;
                        // if neighbor not in openSet, then add it
                        if (!this.openSet.find(node => node.equals(neighbor))) {
                            this.openSet.unshift(neighbor);
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
     * Runs Breadth First Search, until the goal node is reached, or no path can be found.
     * Node weights are not taken into account when pathfinding.
     * @returns if a path to the goal node was found, then the last node in the path will be returned. If
     * no path was found, then null is returned
     */
    run() {
        // openSet is a queue of discovered nodes that need to be evaluated.
        const openSet = [this.grid.startNode];

        // closed set contains nodes that have already been visited
        const closedSet = [];

        while (openSet.length > 0) {

            // pop a node from the openSet queue
            const current = openSet.pop();
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
                if (!this.grid.isObstacleNode(neighbor.row, neighbor.col)) {
                    neighbor.cameFrom = current;
                    // if neighbor not in openSet, then add it
                    if (!openSet.find(node => node.equals(neighbor))) {
                        openSet.unshift(neighbor);
                    }
                }
            }
        }
        // goal never reached, return null
        return null;
    }
}