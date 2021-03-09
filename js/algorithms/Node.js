export {Node}

/**
 * Node holds the current state of a node (a.k.a cell) in the grid.
 * Node's contain a node weight, a current f(n) and f(g) score, and the node's row and col index in the grid.
 * The node's cameFrom property is a link to the previous node in the current lowest score path.
 *
 */
class Node {

    constructor(type, row, col) {
        this.type = type;               // type of node: OBSTACLE_NODE, START_NODE or GOAL_NODE
        this.row = row;                 // the row position of the node in the grid
        this.col = col;                 // the col position of the node in the grid
        this.visited = false;           // has the node been visited yet by the algorithm
        this.weight = 0;                // the weight of this node
        this.f = Infinity;              // node's current f(n) function value
        this.g = Infinity;              // node's current g(n) function value
        this.h = 0;                     // node's current h(n) function value, used by A-Star algorithm
        this.cameFrom = undefined;      // a link to the previous node in the least cost path
    }

    /**
     * euclidian distance between two nodes on a 2D grid
     * @param n1 Node 1
     * @param n2 Node 2
     * @returns {number}
     */
    static euclidianDistance(n1, n2) {
        return Math.sqrt(Math.pow((n1.row - n2.row), 2) + Math.pow((n1.col - n2.col), 2) );
    }

    /**
     * given a Node, follow it's .cameFrom property to reconstruct the path taken to reach the node
     * @param node
     * @returns {[]} an array of node objects where the last node in the array is the start of the path
     */
    static buildPath(node) {
        let path = [];
        let n = node;
        while (n) {
            path.push(n);
            n = n.cameFrom;
        }
        return path;
    }

    /**
     * Compare this node to another node for equality.
     * For simplicity, two nodes are equal if their respective row and col values are equal
     */
    equals(node) {
        return this.row === node.row && this.col === node.col;
    }


    /**
     * Computes the cost of 'moving' from this node to the passed in node.
     * In this application, all moves are to an adjacent node on the grid, so
     * this method simply returns the target node.weight
     * @param node - node to compute
     * @returns {number}
     */
    weightToNode(node) {
        return node.weight;
        //return Node.euclidianDistance(this, node);
    }


}