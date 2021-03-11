import algorithmTypes from "./algorithms/algorithmTypes.js";
import {Grid} from "./algorithms/Grid.js";
import {Canvas} from "./canvas.js";

import AlgorithmFactory from "./algorithms/AlgorithmFactory.js";



let curAlgorithmType        = algorithmTypes.A_STAR;    // set default algorithm
let randomizeObstacleAmt    = 15;                       // 0 to 100, percentage of grid cells to turn into obstacles


// Construct the grid, randomize obstacles, and set the initial pathfinding algorithm to A*
let grid = new Grid(30, 30);
grid.randomizeObstacles(randomizeObstacleAmt);
let algorithm = AlgorithmFactory.build( algorithmTypes.A_STAR, grid);
algorithm.resetState();

// initialize the canvas. Give the cells a 1px border
let canvas = new Canvas(algorithm);
canvas.init();

// set the current grid size and draw the grid
document.getElementById('grid-size-output').innerText = `${canvas.rows}x${canvas.cols}`;
document.getElementById('cell-color-output').innerText = `${canvas.curDrawWeight}`;
document.getElementById('randomize-output').innerText = `${randomizeObstacleAmt}%`;
canvas.drawGridLines();
canvas.drawNodes();
canvas.pause();



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Button Event Listeners for: restart, play/pause, quick-run and clear weights

const restartButton = document.getElementById("restart-btn");
const playPauseButton = document.getElementById("play-pause-btn");
const quickRunButton = document.getElementById("quick-run-btn");
const clearWeightButton = document.getElementById("clear-btn");

restartButton.addEventListener("click", (event) => {
    console.log("Restart", event);
    canvas.restart();
});

playPauseButton.addEventListener('click', (event) => {
    console.log("PlayPause Toggle", event);
    canvas.togglePlayPause();
});

quickRunButton.addEventListener('click', (event) => {
    console.log("QuickRun", event);
    canvas.quickRun();
});

clearWeightButton.addEventListener('click', (event) => {
    console.log("ClearWeights", event);
    canvas.clearGrid();
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

        canvas.algorithm = AlgorithmFactory.build(curAlgorithmType, grid);
        canvas.restart();
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
        canvas.curDrawWeight = sliderValue * 10;
        if (canvas.curDrawWeight >= 10) {
            canvas.curDrawWeight = 1000;
        }
        document.getElementById('cell-color-output').innerText = `${canvas.curDrawWeight}`;
    });


// animation speed range input
document.getElementById("speed-range")
    .addEventListener("input", event => {
        const sliderValue = +event.target.value;
        canvas.animationPauseMs = (sliderValue === 10 ? 0 : (10 / sliderValue) * 100);
        document.getElementById('animation-speed-output').innerText = `${sliderValue * 10}%`;
    });

// grid size range input listener
document.getElementById("grid-size-range")
    .addEventListener("input", event => {
        const sliderValue = +event.target.value;
        const height = sliderValue;
        const width = sliderValue;
        document.getElementById('grid-size-output').innerText = `${height}x${width}`;

        // reconstruct the algorithm
        grid = new Grid(height, width);
        grid.randomizeObstacles(randomizeObstacleAmt);
        const algorithm = AlgorithmFactory.build( curAlgorithmType, grid );
        algorithm.resetState();
        canvas = new Canvas(algorithm, height, width);
        canvas.init();
        canvas.drawGridLines();
        canvas.drawNodes();
        canvas.pause();
    });


// randomize obstacles range input
document.getElementById("randomize-range")
    .addEventListener("input", event => {
        randomizeObstacleAmt = +event.target.value;
        document.getElementById('randomize-output').innerText = `${randomizeObstacleAmt}%`;
        canvas.algorithm.getGrid().resetNodeWeights();
        canvas.algorithm.resetState();
        canvas.algorithm.getGrid().randomizeObstacles(randomizeObstacleAmt);
        canvas.drawGridLines();
        canvas.drawNodes();
        canvas.pause();
    });

