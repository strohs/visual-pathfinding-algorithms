import algorithmTypes from "./algorithmTypes.js";
import {AStar} from "./AStar.js";
import {Dijkstra} from "./Dijkstra.js";
import {DepthFirstSearch} from "./depthFirstSearch.js";
import {BreadthFirstSearch} from "./breadthFirstSearch.js";


export default class AlgorithmFactory {

    /**
     * a factory "method" that builds a new pathfinding algorithm based on the algorithmType parameter
     * @param algorithmType
     * @param grid - the grid object that will be used for pathfinding
     * @returns {AStar|DepthFirstSearch|BreadthFirstSearch|Dijkstra}
     */
    static build(algorithmType, grid) {
        let algo;
        if (algorithmType === algorithmTypes.A_STAR) {
            algo = new AStar(grid);
        } else if (algorithmType === algorithmTypes.DIJKSTRA) {
            algo = new Dijkstra(grid);
        } else if (algorithmType === algorithmTypes.DEPTH_FIRST_SEARCH) {
            algo = new DepthFirstSearch(grid);
        } else if (algorithmType === algorithmTypes.BREADTH_FIRST_SEARCH) {
            algo = new BreadthFirstSearch(grid);
        }
        return algo;
    }
}
