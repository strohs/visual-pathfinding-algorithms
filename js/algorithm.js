import {Node} from "./node.js";



const finishedStatus = {
    PATH_FOUND: 0,
    PATH_NOT_FOUND: 1,
};


class Algorithm {

    constructor(grid) {
        this.grid = grid;
    }

    /**
     * resets Node function values and algorithm variables to their initial values, so that the search can be
     * run again. This method does not resetState node weights or start/goal nodes
     */
    resetState() {
        for (let r = 0; r < this.grid.rows; r++) {
            for (let c = 0; c < this.grid.cols; c++) {
                this.grid.nodes[r][c].cameFrom = undefined;
                this.grid.nodes[r][c].f = Infinity;
                this.grid.nodes[r][c].g = Infinity;
                this.grid.nodes[r][c].visited = false;
            }
        }
        this.openSet = [this.grid.startNode];
        this.closedSet = [];
        this.currentNode = this.grid.startNode;
        this.finishStatus = undefined;
        this.finished = false;
        this.grid.startNode.f = 0;
        this.grid.startNode.g = 0;
    }

    /**
     * reconstruct the current (lowest cost) path that was found by the this algorithm
     * @returns {*[]} an array of Node, where each node is part of the lowest cost path
     */
    buildCurrentPath() {
        return Node.buildPath(this.currentNode);
    }

    /**
     * has the algorithm completed?
     * @returns {boolean} true if completed, else false
     */
    isFinished() {
        return this.finished;
    }

    /**
     * returns the finished status of the algorithm, either 'PATH_FOUND' or 'NO_PATH_FOUND'
     * @returns {string}
     */
    getFinishedStatus() {
        return this.finishStatus;
    }

    setFinishedStatus(status) {
        this.finishStatus = status;
    }

    getGrid() {
        return this.grid;
    }

    setGrid(grid) {
        this.grid = grid;
    }

    getAlgorithmName() {
        return this.algorithmName
    }
}

export {Algorithm, finishedStatus};