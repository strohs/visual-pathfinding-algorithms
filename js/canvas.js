import {weightToHexColor} from "./util/color.js";
import {finishedStatus} from "./algorithms/Algorithm.js";
import {setNotificationMessage} from "./ui/notificationBox.js";
import {Node} from "./algorithms/Node.js";

// colors used for drawing the grid, cells, and paths
const Colors = {
    GRID_COLOR: "#CCCCCC",
    EMPTY_COLOR: "#FFFFFF",
    PATH_COLOR: "#c66cd8",
    VISITED_PATH_COLOR: "#bcb8b7",
    OBSTACLE_COLOR: "#000000",
    START_COLOR: "#33ff83",
    END_COLOR: "#ff0500",
}

/**
 * Canvas is the central class responsible for drawing a path finding algorithm onto a HTML canvas element.
 *
 */
export class Canvas {

    // the current weight to use for drawing nodes
    curDrawWeight = 1000;
    // holds the current mouse left click state
    _isLeftClickDown = false;
    // how long to pause between animation frames
    animationPauseMs = 0;
    // true if the animation should be paused, false to begin playing
    _isPaused = true;


    constructor(algorithm, rows=30, cols=30, cellSizePx=10 ) {
        this.rows = rows;
        this.cols = cols;
        this.cellSizePx = cellSizePx;
        this.algorithm = algorithm;
    }

    // initialize the Canvas and create a new 2d context
    init() {
        const canvas = document.getElementById("grid-canvas");
        canvas.height = (this.cellSizePx + 1) * this.rows + 1;
        canvas.width = (this.cellSizePx + 1) * this.cols + 1;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // register event listeners
        this.clickHandler();
        this.mouseDownHandler();
        this.mouseUpHandler();
        this.mouseMoveHandler();
    }

    get isPaused() {
        return this._isPaused;
    }

    set isPaused(bValue) {
        this._isPaused = bValue;
    }

    // toggle between playing and pausing the canvas animation
    togglePlayPause() {
        this.isPaused ? this.isPaused = false : this.isPaused = true;
        if (!this.isPaused) {
            console.log("now playing");
            this.play();
        } else {
            console.log("now pausing");
            this.pause();
        }
    }

    // restart the animation
    restart() {
        this.algorithm.resetState();
        setNotificationMessage(null, null);
        this.drawNodes();
        this.pause();
    }

    // clear the canvas of all obstacles and reset the current algorithm
    clearGrid() {
        this.algorithm.getGrid().resetNodeWeights();
        this.algorithm.resetState();
        this.drawGridLines();
        this.drawNodes();
    }

    // run the pathfinding till completion
    quickRun() {
        // Run the current algorithm to completion, skipping all animation
        this.pause();
        setNotificationMessage(null, null, `${this.algorithm.algorithmName} quick run...`);
        this.algorithm.resetState();
        const start = Date.now();
        const resNode = this.algorithm.run(Node.euclidianDistance);
        const end = Date.now() - start;
        this.drawGridLines();
        this.drawNodes();
        if (resNode) {
            setNotificationMessage(`Done! Path found in ${end}ms [path length=${this.algorithm.buildCurrentPath().length}, total weight=${this.algorithm.currentNode.f}]`, null);
            this.drawPath(Node.buildPath(resNode), Colors.START_COLOR);
        } else {
            setNotificationMessage(null, `No Path was found: (${end}ms)`);
        }
    }


    /**
     * draw grid lines between cells on the canvas
     */
    drawGridLines() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = Colors.GRID_COLOR;

        // Vertical lines.
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.moveTo(i * (this.cellSizePx + 1) + 1, 0);
            this.ctx.lineTo(i * (this.cellSizePx + 1) + 1, (this.cellSizePx + 1) * this.rows + 1);
        }

        // Horizontal lines.
        for (let j = 0; j <= this.rows; j++) {
            this.ctx.moveTo(0, j * (this.cellSizePx + 1) + 1);
            this.ctx.lineTo((this.cellSizePx + 1) * this.cols + 1, j * (this.cellSizePx + 1) + 1);
        }

        this.ctx.stroke();
    }

    /**
     * draw the nodes contained within the grid on this canvas
     * @param grid {Grid} - the backing Grid class that holds the current state of the nodes
     */
    drawNodes() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.algorithm.getGrid().isStartNode(row, col)) {
                    this.ctx.fillStyle = Colors.START_COLOR;
                } else if (this.algorithm.getGrid().isGoalNode(row, col)) {
                    this.ctx.fillStyle = Colors.END_COLOR;
                } else {
                    //if (grid.nodes[row][col].visited === true) {
                    //    ctx.fillStyle = VISITED_PATH_COLOR;
                    //} else {
                    // compute cell color based on the current node's weight
                    this.ctx.fillStyle = weightToHexColor(this.algorithm.getGrid().nodes[row][col].weight, 9);
                    //}
                }
                this.ctx.fillRect(
                    col * (this.cellSizePx + 1) + 1,
                    row * (this.cellSizePx + 1) + 1,
                    this.cellSizePx,
                    this.cellSizePx
                );
            }
        }
    }

    /**
     * draw the current shortest path on the canvas
     * @param grid {Grid} - the Grid class that holds the current nodes being used be a search algorithm
     * @param nodeList - an Array containing the nodes that are on the shortest path
     * @param color - a color string i.e. #c66cd8 that will be used to color the path
     */
    drawPath(nodeList, color) {

        for (let i = nodeList.length - 1; i >= 0; i--) {
            const n = nodeList[i];

            // don't want to draw over START/GOAL nodes
            if (!this.algorithm.getGrid().isStartNode(n.row, n.col) && !this.algorithm.getGrid().isGoalNode(n.row, n.col) ) {
                this.ctx.fillStyle = color;
                this.ctx.fillRect(
                    n.col * (this.cellSizePx + 1) + 1,
                    n.row * (this.cellSizePx + 1) + 1,
                    this.cellSizePx,
                    this.cellSizePx
                );
            }
        }
    }

    /**
     * begins playing the algorithm animation by triggering the renderLoop()
     */
    play() {
        // only play if the current running algorithm is not finished
        if (!this.algorithm.isFinished()) {
            const icon = document.getElementById("play-btn-icon");
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            this.isPaused = false;
            setNotificationMessage(null, null, `${this.algorithm.algorithmName} Running...`);
            this.render();
        }
    }

    /**
     * pause the algorithm animation
     */
    pause() {
        const icon = document.getElementById("play-btn-icon");
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        //cancelAnimationFrame(animationId);
        setNotificationMessage(null, null, `${this.algorithm.algorithmName} PAUSED`);
        this.isPaused = true;
    }

    /**
     * render the current path-finding algorithm onto the canvas
     * @param algorithm
     */
    render() {
        if (!this.isPaused) {
            setTimeout(() => {

                // perform one tick of the algorithm
                this.algorithm.tick();

                // check if the algorithm is finished and print results to notification area
                if (this.algorithm.isFinished()) {
                    if (this.algorithm.getFinishedStatus() === finishedStatus.PATH_FOUND) {
                        setNotificationMessage(`Path to goal was found! [path length=${this.algorithm.buildCurrentPath().length} total weight=${this.algorithm.currentNode.f}]`, null);
                    } else if (this.algorithm.getFinishedStatus() === finishedStatus.PATH_NOT_FOUND) {
                        setNotificationMessage(null, 'No Path to goal found.');
                    }
                }

                // draw the nodes (cells) of the grid
                this.drawNodes();

                //draw current path being explored
                this.drawPath(this.algorithm.buildCurrentPath(), Colors.START_COLOR);

                requestAnimationFrame(this.render.bind(this));
            }, this.animationPauseMs);
        }
    }

    // handle left-click on the canvas
    clickHandler() {
        // grid left click listener
        this.canvas.addEventListener("click", event => {
            const boundingRect = this.canvas.getBoundingClientRect();

            const scaleX = this.canvas.width / boundingRect.width;
            const scaleY = this.canvas.height / boundingRect.height;

            const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
            const canvasTop = (event.clientY - boundingRect.top) * scaleY;

            const row = Math.min(Math.floor(canvasTop / (this.cellSizePx + 1)), this.rows - 1);
            const col = Math.min(Math.floor(canvasLeft / (this.cellSizePx + 1)), this.cols - 1);

            if (event.ctrlKey) {
                this.pause();
                this.algorithm.getGrid().setGoalNode(row, col);
                this.algorithm.resetState();
            } else if (event.shiftKey) {
                this.pause();
                this.algorithm.getGrid().setStartNode(row, col);
                this.algorithm.resetState();
            } else {
                // regular click
                if (!this._isLeftClickDown) {
                    this.algorithm.getGrid().setWeight(row, col, this.curDrawWeight);
                }
            }
            this.drawNodes();
        });
    }

    mouseDownHandler() {
        this.canvas.addEventListener('mousedown', () => this._isLeftClickDown = true);
    }

    mouseUpHandler() {
        this.canvas.addEventListener('mouseup', () => this._isLeftClickDown = false);
    }

    mouseMoveHandler() {
        this.canvas.addEventListener("mousemove", event => {
            if (this._isLeftClickDown) {
                const boundingRect = this.canvas.getBoundingClientRect();

                const scaleX = this.canvas.width / boundingRect.width;
                const scaleY = this.canvas.height / boundingRect.height;

                const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
                const canvasTop = (event.clientY - boundingRect.top) * scaleY;

                const row = Math.min(Math.floor(canvasTop / (this.cellSizePx + 1)), this.rows - 1);
                const col = Math.min(Math.floor(canvasLeft / (this.cellSizePx + 1)), this.cols - 1);

                //console.log('mouse down and move', row, col, event);
                this.algorithm.getGrid().setWeight(row, col, this.curDrawWeight);
                this.drawNodes();
            }

        })
    }
}