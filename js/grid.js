import nodeTypes from "./nodeTypes.js";
import {Node} from "./node.js";
export {Grid};

const MIN_NODE_WEIGHT = 1;
const MAX_NODE_WEIGHT = 100;

/**
 * Grid encapsulates a two dimensional array of Node objects.
 * The grid is then passed into an algorithm class and used by it to find a path from start node to
 * goal node.
 *
 */
class Grid {


    /**
     * build a new 2D grid of empty Nodes (all nodes will have weight = 1;
     * Sets the start node and goal node
     * @param rows - the number of rows in the grid
     * @param cols - the number of columns in the grid
     * @param startRow - row index of the start node (defaults to 0)
     * @param startCol - column index of the start node (defaults to 0)
     * @param endRow - row index of the end node (defaults to rows - 1)
     * @param endCol - column index of the end node (
     */
    constructor(rows, cols, startRow = 0, startCol = 0, endRow = rows - 1, endCol = cols - 1) {
        this.rows = rows;
        this.cols = cols;
        this.nodes = [[]];
        this.initializeGrid();

        // set end node and start node
        this.goalNode = this.nodes[endRow][endCol];
        this.startNode = this.nodes[startRow][startCol];
        this.goalNode.type = nodeTypes.GOAL_NODE;
        this.startNode.type = nodeTypes.START_NODE;
    }

    /**
     * tests if the index at r,c exists in this grid
     * @private
     * @param r - row index in the grid
     * @param c - column index in the grid
     * @returns {boolean}
     */
    exists(r, c) {
        return r in this.nodes && c in this.nodes[r];
    }

    /**
     * computes the indices of the specified node's neighbors
     * @private
     * @param row - row index of the node in the grid
     * @param col - column indices of the node in the grid
     * @returns {[]} an Array of Arrays, where each subArray contains a pair of [row, col] indices: [[0,1], [2,3], ...]
     */
    neighborIndices(row, col) {
        let indices = [];
        this.exists(row, col - 1) ? indices.push( [row, col - 1] ) : undefined;
        this.exists(row, col + 1) ? indices.push( [row, col + 1] ) : undefined;
        this.exists(row - 1, col) ? indices.push( [row - 1, col] ) : undefined;
        this.exists(row + 1, col) ? indices.push( [row + 1, col] ) : undefined;

        // uncomment these next 4 lines to allow diagonal neighbors to be returned to pathfinding algorithms.
        //   this will greatly speed up A*
        // this.exists(row - 1, col - 1) ? indices.push( [row - 1, col - 1] ) : undefined;
        // this.exists(row - 1, col + 1) ? indices.push( [row - 1, col + 1] ) : undefined;
        // this.exists(row + 1, col + 1) ? indices.push( [row + 1, col + 1] ) : undefined;
        // this.exists(row + 1, col - 1) ? indices.push( [row + 1, col - 1] ) : undefined;

        return indices;
    }

    /**
     * return all neighbors of the specified node, (doesn't) include the specified node
     * @param row - row index of the node in the grid
     * @param col - column index of the node in the grid
     * @returns {*[]} the nodes that are neighbors of the node at index: row, col
     */
    neighbors(row, col) {
        return this.neighborIndices(row, col)
            .map(([r, c]) => this.nodes[r][c]);
    }

    /**
     * helper method that initializes the Nodes in this grid to EMPTY_NODES and weight = 1
     * @private
     */
    initializeGrid() {
        let grid = [];
        for (let r=0; r < this.rows; r++) {
            let row = [];
            for (let c=0; c < this.cols; c++) {
                const node = new Node(nodeTypes.EMPTY_NODE, r, c);
                node.weight = MIN_NODE_WEIGHT;
                row.push(node);
            }
            grid.push(row);
        }
        this.nodes = grid;
    }

    /**
     * sets the Node to an obstacle node at the given row, col index
     * @param row - the row index of the node in this grid
     * @param col - column index of the node in this grid
     */
    setObstacle(row, col) {
        //this.nodes[row][col].type = nodeTypes.OBSTACLE_NODE;
        this.nodes[row][col].weight = MAX_NODE_WEIGHT;
    }

    setEmptyNode(row, col) {
        //this.nodes[row][col].type = nodeTypes.EMPTY_NODE;
        this.nodes[row][col].weight = MIN_NODE_WEIGHT;
    }

    getWeight(row, col) {
        return this.nodes[row][col].weight;
    }
    setWeight(row, col, weight) {
        this.nodes[row][col].weight = weight;
    }

    /**
     * set a new starting node in the Grid,
     * The old START NODE becomes an empty node with weight = 1
     * @param row - row position of new start node
     * @param col - col position of new start node
     */
    setStartNode(row, col) {
        const oldRow = this.startNode.row;
        const oldCol = this.startNode.col;
        this.nodes[oldRow][oldCol].type = nodeTypes.EMPTY_NODE;
        this.nodes[oldRow][oldCol].weight = MIN_NODE_WEIGHT;
        this.nodes[row][col].type = nodeTypes.START_NODE;
        this.nodes[row][col].weight = MIN_NODE_WEIGHT;
        this.startNode = this.nodes[row][col];
    }

    /**
     * set the node at index row, col to a GOAL NODE,
     * The old GOAL NODE becomes an empty node with weight = 1
     * @param row
     * @param col
     */
    setGoalNode(row, col) {
        const oldRow = this.goalNode.row;
        const oldCol = this.goalNode.col;
        this.nodes[oldRow][oldCol].type = nodeTypes.EMPTY_NODE;
        this.nodes[oldRow][oldCol].weight = MIN_NODE_WEIGHT;
        this.nodes[row][col].type = nodeTypes.GOAL_NODE;
        this.nodes[row][col].weight = MIN_NODE_WEIGHT;
        this.goalNode = this.nodes[row][col];
    }


    isEmptyNode(row, col) {
        return this.nodes[row][col].weight <= MIN_NODE_WEIGHT;
    }

    isObstacleNode(row, col) {
        return this.nodes[row][col].weight >= MAX_NODE_WEIGHT || this.nodes[row][col].type === nodeTypes.OBSTACLE_NODE;
    }

    isStartNode(row, col) {
        return this.nodes[row][col].type === nodeTypes.START_NODE;
    }

    isGoalNode(row, col) {
        return this.nodes[row][col].type === nodeTypes.GOAL_NODE;
    }

    /**
     * resets all node weights to 1
     */
    resetNodeWeights() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.nodes[r][c].weight = MIN_NODE_WEIGHT;
            }
        }
    }

    // /**
    //  * toggles the type of node between EMPTY_NODE and OBSTACLE_NODE
    //  * @param row
    //  * @param col
    //  */
    // toggleObstacle(row, col) {
    //     if (this.nodes[row][col].type === nodeTypes.EMPTY_NODE) {
    //         this.nodes[row][col].type = nodeTypes.OBSTACLE_NODE;
    //     } else if (this.nodes[row][col].type === nodeTypes.OBSTACLE_NODE) {
    //         this.nodes[row][col].type = nodeTypes.EMPTY_NODE;
    //     }
    // }

    /**
     * randomize the amount of obstacle nodes in this grid
     * @param amount - an integer between 0 and 100 indicating what percentage of nodes should become obstacles
     */
    randomizeObstacles(amount) {
        const isStartNode = (r,c) => this.startNode.row === r && this.startNode.col === c;
        const isGoalNode = (r,c) => this.goalNode.row === r && this.goalNode.col === c;

        for (let r=0; r < this.rows; r++) {
            for (let c=0; c < this.cols; c++) {
                if (Math.random() <= (amount / 100.0) &&
                    !isStartNode(r, c) &&
                    !isGoalNode(r, c)) {
                    this.setObstacle(r, c);
                }
            }
        }
    }



    // randomizeObstacles(amount) {
    //     const indices = [];     // holds 1D indices into this.grid
    //     const startNodeIndex = this.startNode.row * this.cols + this.startNode.col;
    //     const endNodeIndex = this.endNode.row * this.cols + this.endNode.col;
    //
    //     // build an array of 1D indices
    //     for (let i=0; i < this.rows * this.cols; i++) {
    //         indices.push(i);
    //     }
    //     // shuffle the indices using knuth shuffle
    //     Grid.shuffle(indices);
    //     // take indicates the amount of indices to take from the array
    //     const take = this.rows * this.cols * amount / 100;
    //     for (let i=0; i < take; i++) {
    //         const r = Math.floor(indices[i] / this.rows);   // convert 1D indices to 2D
    //         const c = indices[i] % this.cols;
    //         // don't set the startNode or endNode to an obstacle
    //         if (indices[i] !== startNodeIndex && indices[i] !== endNodeIndex) {
    //             this.setObstacle(r,c);
    //         }
    //     }
    // }


    // shuffle elements of an array in place using Knuth's shuffle
    static shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const ridx = Math.floor( Math.random() * i);
            const temp = arr[i];
            arr[i] = arr[ridx];
            arr[ridx] = temp;
        }
    }

}

