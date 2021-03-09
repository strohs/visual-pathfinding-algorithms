import algorithmTypes from "./algorithms/algorithmTypes.js";
import {Node} from "./algorithms/Node.js";
import {Grid} from "./algorithms/Grid.js";

import {finishedStatus} from "./algorithms/Algorithm.js";
import AlgorithmFactory from "./algorithms/AlgorithmFactory.js";
import {weightToHexColor} from "./util/color.js";

const CELL_SIZE             = 10;                       // size of a cell on the grid in pixels
const GRID_COLOR            = "#CCCCCC";                // colors used for drawing the grid, cells, and paths
const EMPTY_COLOR           = "#FFFFFF";
const PATH_COLOR            = "#c66cd8";
const VISITED_PATH_COLOR    = "#bcb8b7";
const OBSTACLE_COLOR        = "#000000";
const START_COLOR           = "#33ff83";
const END_COLOR             = "#ff0500";


let width                   = 30;                       // current grid width (# of rows)
let height                  = 30;                       // current grid height (# of columns)
let curAlgorithmType        = algorithmTypes.A_STAR;    // set default algorithm
let simIsPaused             = true;                     // is the simulation currently paused
let animationPauseMs        = 0;                        // how long to pause between animation frames
let randomizeObstacleAmt    = 15;                       // 0 to 100, percentage of grid cells to turn into obstacles
let isLeftClickDown         = false;                    // holds the current mouse left click state
let curDrawWeight           = 1000;                     // the current selected draw weight from the Draw Cell Weight slider



// initialize the canvas. Give the cells a 1px border
const canvas    = document.getElementById("grid-canvas");
canvas.height   = (CELL_SIZE + 1) * height + 1;
canvas.width    = (CELL_SIZE + 1) * width + 1;
const ctx       = canvas.getContext('2d');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// canvas rendering methods

/**
 * the main render loop that animates the current path and draws the grid
 */
const renderLoop = () => {
    if (!simIsPaused) {
        setTimeout(() => {

            // perform one tick of the algorithm
            algorithm.tick();

            // check if the algorithm is finished and print results to notification area
            if (algorithm.isFinished()) {
                if (algorithm.getFinishedStatus() === finishedStatus.PATH_FOUND) {
                    setNotificationMessage(`Path to goal was found! [path length=${algorithm.buildCurrentPath().length} total weight=${algorithm.currentNode.f}]`, null);
                } else if (algorithm.getFinishedStatus() === finishedStatus.PATH_NOT_FOUND) {
                    setNotificationMessage(null, 'No Path to goal found.');
                }
            }

            // draw the nodes (cells) of the grid
            drawNodes();

            //draw current path being explored
            drawPath(algorithm.buildCurrentPath(), START_COLOR);

            requestAnimationFrame(renderLoop);
        }, animationPauseMs);
    }
};


// draw grid lines between cells on the canvas
const drawGridLines = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};


// draw the grid nodes on the canvas
const drawNodes = () => {
    const grid = algorithm.getGrid();
    //ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            if (grid.isStartNode(row, col)) {
                ctx.fillStyle = START_COLOR;
            } else if (grid.isGoalNode(row, col)) {
                ctx.fillStyle = END_COLOR;
            } else {
                //if (grid.nodes[row][col].visited === true) {
                //    ctx.fillStyle = VISITED_PATH_COLOR;
                //} else {
                    // compute cell color based on the current node's weight
                    const drawColor = weightToHexColor( grid.nodes[row][col].weight, 9);
                    ctx.fillStyle = drawColor;
                //}
            }
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
    //ctx.stroke();
};

/**
 * draw the current shortest path on the canvas
 * @param nodeList - an Array containing the nodes that are on the shortest path
 * @param color - a color string i.e. #c66cd8 that will be used to color the path
 */
const drawPath = (nodeList, color) => {

    // ctx.beginPath();
    for (let i = nodeList.length - 1; i >= 0; i--) {
        const n = nodeList[i];

        // don't want to draw over START/GOAL nodes
        if (!algorithm.getGrid().isStartNode(n.row, n.col) && !algorithm.getGrid().isGoalNode(n.row, n.col) ) {
            ctx.fillStyle = color;
            ctx.fillRect(
                n.col * (CELL_SIZE + 1) + 1,
                n.row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
    //ctx.stroke();
};

/**
 * begins playing the algorithm animation by triggering the renderLoop()
 */
const play = () => {
    // only play if the current running algorithm is not finished
    if (!algorithm.isFinished()) {
        const icon = document.getElementById("play-btn-icon");
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        simIsPaused = false;
        setNotificationMessage(null, null, 'Running...');
        renderLoop();
    }
};

/**
 * pause the algorithm animation
 */
const pause = () => {
    const icon = document.getElementById("play-btn-icon");
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
    //cancelAnimationFrame(animationId);
    setNotificationMessage(null, null, 'PAUSED');
    simIsPaused = true;
};

// restart the application
export const restart = () => {
    algorithm.resetState();
    setNotificationMessage(null, null);
    drawNodes();
    pause();
}

// clear the grid of all obstacle nodes that were drawn
const clearGrid = () => {
    algorithm.getGrid().resetNodeWeights();
    algorithm.resetState();
    drawGridLines();
    drawNodes();
}

// toggle playing and pausing the path-finding animation
const togglePlayPause = () => {
    if (simIsPaused) {
        console.log("now playing");
        play();
    } else {
        console.log("now pausing");
        pause();
    }
}

// trigger the quick run
const quickRun = () => {
    // Run the current algorithm to completion, skipping all animation
    pause();
    setNotificationMessage(null, null, 'Running...');
    algorithm.resetState();
    const start = Date.now();
    const resNode = algorithm.run(Node.euclidianDistance);
    const end = Date.now() - start;
    drawGridLines();
    drawNodes();
    if (resNode) {
        setNotificationMessage(`Done! Path found in ${end}ms [path length=${algorithm.buildCurrentPath().length}, total weight=${algorithm.currentNode.f}]`, null);
        drawPath(Node.buildPath(resNode), START_COLOR);
    } else {
        setNotificationMessage(null, `No Path was found: (${end}ms)`);
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Button Event Listeners for: restart, play/pause, quick-run and clear weights

const restartButton = document.getElementById("restart-btn");
const playPauseButton = document.getElementById("play-pause-btn");
const quickRunButton = document.getElementById("quick-run-btn");
const clearWeightButton = document.getElementById("clear-btn");

restartButton.addEventListener("click", (event) => {
    console.log("Restart", event);
    restart();
});

playPauseButton.addEventListener('click', (event) => {
    console.log("PlayPause Toggle", event);
    togglePlayPause();
});

quickRunButton.addEventListener('click', (event) => {
    console.log("QuickRun", event);
    quickRun();
});

clearWeightButton.addEventListener('click', (event) => {
    console.log("ClearWeights", event);
    clearGrid();
});





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Canvas Event Listeners

// grid left click listener
canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    if (event.ctrlKey) {
        pause();
        algorithm.getGrid().setGoalNode(row, col);
        algorithm.resetState();
    } else if (event.shiftKey) {
        pause();
        algorithm.getGrid().setStartNode(row, col);
        algorithm.resetState();
    } else {
        // regular click
        if (!isLeftClickDown) {
            algorithm.getGrid().setWeight(row, col, curDrawWeight);
        }
    }
    drawNodes();
});

// these two listeners are for capture the state of left click and hold events
canvas.addEventListener('mousedown', () => isLeftClickDown = true);
canvas.addEventListener('mouseup', () => isLeftClickDown = false);

canvas.addEventListener("mousemove", event => {
    if (isLeftClickDown) {
        const boundingRect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / boundingRect.width;
        const scaleY = canvas.height / boundingRect.height;

        const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
        const canvasTop = (event.clientY - boundingRect.top) * scaleY;

        const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
        const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

        //console.log('mouse down and move', row, col, event);
        algorithm.getGrid().setWeight(row, col, curDrawWeight);
        drawNodes();
    }

});





//////////////////////////////////////////////////////////////////////////////////////////
// Navbar Menu listeners

// navbar algorithm dropdown menu listener
document.getElementById('algorithm-menu')
    .addEventListener('click', event => {
        // set active menu item
        event.target.classList.add('is-active');
        const sibs = Array.prototype.filter.call(event.target.parentNode.children, function (sibling) {
            return sibling !== event.target;
        });

        for (let elem of sibs) {
            elem.classList.remove('is-active');
        }

        // set current algorithm
        if (event.target.id === 'algorithm-menu-astar') {
            curAlgorithmType = algorithmTypes.A_STAR;
        } else if (event.target.id === 'algorithm-menu-dijk') {
            curAlgorithmType = algorithmTypes.DIJKSTRA;
        } else if (event.target.id === 'algorithm-menu-depth-first') {
            curAlgorithmType = algorithmTypes.DEPTH_FIRST_SEARCH;
        } else if (event.target.id === 'algorithm-menu-breadth-first') {
            curAlgorithmType = algorithmTypes.BREADTH_FIRST_SEARCH;
        }
        algorithm = AlgorithmFactory.build(curAlgorithmType, grid);
        restart();
    });

// help button click listener
document.getElementById('help-btn')
    .addEventListener('click', event => {
        const helpModal = document.getElementById('help-modal');
        console.log('help click', helpModal.className);
        (helpModal.classList.contains('is-active')) ? helpModal.className = 'modal' : helpModal.className = 'modal is-active'
    });

// listener to toggle display of hamburger menu items
document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////
// UI Range Slider Listeners

// cell color range input listener
document.getElementById("cell-color-range")
    .addEventListener("input", event => {
        const sliderValue = +event.target.value;
        curDrawWeight = sliderValue * 10;
        if (curDrawWeight >= 10) {
            curDrawWeight = 1000;
        }
        document.getElementById('cell-color-output').innerText = `${curDrawWeight}`;
    });


// animation speed range input
document.getElementById("speed-range")
    .addEventListener("input", event => {
        const sliderValue = +event.target.value;
        animationPauseMs = (sliderValue === 10 ? 0 : (10 / sliderValue) * 100);
        document.getElementById('animation-speed-output').innerText = `${sliderValue * 10}%`;
    });

// grid size range input listener
document.getElementById("grid-size-range")
    .addEventListener("input", event => {
        const sliderValue = +event.target.value;
        height = sliderValue;
        width = sliderValue;
        canvas.height = (CELL_SIZE + 1) * height + 1;
        canvas.width = (CELL_SIZE + 1) * width + 1;
        document.getElementById('grid-size-output').innerText = `${height}x${width}`;

        // reconstruct the algorithm
        grid = new Grid(height, width);
        grid.randomizeObstacles(randomizeObstacleAmt);
        algorithm = AlgorithmFactory.build( curAlgorithmType, grid );
        algorithm.resetState();
        drawGridLines();
        drawNodes();
        pause();
    });


// randomize obstacles range input
document.getElementById("randomize-range")
    .addEventListener("input", event => {
        randomizeObstacleAmt = +event.target.value;
        document.getElementById('randomize-output').innerText = `${randomizeObstacleAmt}%`;
        algorithm.getGrid().resetNodeWeights();
        algorithm.resetState();
        algorithm.getGrid().randomizeObstacles(randomizeObstacleAmt);
        drawGridLines();
        drawNodes();
        pause();
    });



/**
 * set a message to appear in the Notification box of the UI
 * @param successMsg - a string that will appear with a green background
 * @param errorMsg - a string that will display in the notification box with a red background
 * @param infoMsg - a string that will appear in the default grey background
 */
export const setNotificationMessage = (successMsg, errorMsg, infoMsg) => {
    const notificationBox = document.getElementById("notification-box");
    const messageContainer = document.querySelector('.message-container');

    if (successMsg) {
        notificationBox.className = 'notification is-success';
        messageContainer.textContent = algorithm.getAlgorithmName() + " " + successMsg;
    } else if (errorMsg) {
        notificationBox.className = 'notification is-danger';
        messageContainer.textContent = algorithm.getAlgorithmName() + " " + errorMsg;
    } else {
        notificationBox.className = 'notification';
        messageContainer.textContent = algorithm.getAlgorithmName() + " " + infoMsg;
    }
};



// Construct the grid, randomize obstacles, and set the initial pathfinding algorithm to A*
let grid = new Grid(height, width);
grid.randomizeObstacles(randomizeObstacleAmt);
let algorithm = AlgorithmFactory.build( algorithmTypes.A_STAR, grid);
algorithm.resetState();

// set the current grid size and draw the grid
document.getElementById('grid-size-output').innerText = `${height}x${width}`;
document.getElementById('cell-color-output').innerText = `${curDrawWeight}`;
document.getElementById('randomize-output').innerText = `${randomizeObstacleAmt}%`;
drawGridLines();
drawNodes();
pause();