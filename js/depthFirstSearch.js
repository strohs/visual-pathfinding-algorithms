import {Node} from "./Node.js";
import {Algorithm, finishedStatus} from "./Algorithm.js";

export {DepthFirstSearch};



/**
 * Implementation of BRUTE-FORCE pathfinding using Depth First Search.
 * This class will use depth first search to move through the grid until the goal is either found OR
 * not found (because the path to the goal was blocked by obstacle nodes)
 *
 */
class DepthFirstSearch extends Algorithm {

    /**
     *
     * @param grid - Grid object to apply the depth first search to
     */
    constructor(grid) {
        super(grid);
        this.algorithmName = 'Depth First';
    }


    /**
     * performs a single tick of the algorithm. When the tick is complete, this.currentNode will
     * contain the last node of the path currently being explored.
     * @returns {Node} the last node in the path currently being explored by the algorithm, OR undefined if no
     * path to the goal node could be found
     */
    tick() {
        if (!this.finished) {
            if (this.openSet.length > 0) {
                // current is node having the lowest fScore in openSet,
                // sort openSet so lowest f-score is at end of the array, then pop it off the end
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
                            this.openSet.push(neighbor);
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
     * Full implementation of a pathfinding algorithm, using depth-first search.
     * This algorithm does not take node weights into account, it simply pushes neighbor nodes onto a stack, and pops
     * them off one at a time until the goal node is reached, OR until all nodes have been explored.
     * @returns if a path to the goal node was found, then the last node in the lowest cost path will be returned. If
     * no path was found, then null is returned
     */
    run() {
        // openSet is a stack of discovered nodes that need to be evaluated.
        const openSet = [this.grid.startNode];

        // closed set contains nodes that have already been visited
        const closedSet = [];

        while (openSet.length > 0) {

            // current is the node at the head of the stack.
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
                // don't examine obstacle nodes
                if (!this.grid.isObstacleNode(neighbor.row, neighbor.col)) {
                    neighbor.cameFrom = current;
                    // if neighbor not in openSet, push it onto the stack
                    if (!openSet.find(node => node.equals(neighbor))) {
                        openSet.push(neighbor);
                    }
                }
            }
        }
        // goal never reached, return null
        return null;
    }
}