Visual Path-finding Algorithms
===================================
This is a browser application (HTML / canvas / JavaScript ES6) that animates path-finding algorithms 
(currently A* and Dijkstra's) as they find the lowest cost path from a start cell to a
goal cell on a two-dimensional grid.

The application allows you to:
* set the positions of the start and goal cells
* click on cells to change their weight values 
* change the animation speed (or skip the animation and just run the algorithm to completion)
* generate random 'obstacle' cells
* change the grid size (currently grids between 10x10 and 100x100 are supported) 

In addition to [A*](https://en.wikipedia.org/wiki/A*_search_algorithm) 
and [Dijkstra's](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) algorithms, 
the application also implements a basic Breadth First and a Depth First search so that you can see how 
they compare to the previous two algorithms.


<img src="https://github.com/strohs/visual-pathfinding-algorithms/blob/master/images/pathfinding2.png" width="400"/>



## Running
Make sure you're using a web browser that supports javascript ES6. If you're using an IDE that comes bundled with
a local HTTP server, then the quickest way to run this application is to open the index.html page in your IDE.
Otherwise, you'll need to host it using your http server of choice.  I used Node.js (with the http-server package)

#### Node.js
If you have Node.js and npm installed, from the project root directory, run
> npm install

then

> npm start

and open your browser to [localhost:8080](http://localhost:8080)





## Quick Start
Once the page loads, it will generate a 50x50 grid with random "obstacle" cells (they are colored black) 
* Left click (or left click and drag) on the grid to draw cells with the current weight value from 
the **Cell Weight** slider
* Algorithms can be changed using the dropdown menu in the top right of the navbar
* The *start cell* is in the upper left of the grid and is colored green. It always has a weight of 1, and can be 
moved by **Shift+Left Clicking** another cell in the grid.
* The *goal cell* is in the lower right and is colored red. It always has a weight of 1, and can be moved 
by **Ctrl+Left Clicking** another cell in the grid.
* To start pathfinding, click the blue play button (upper middle of the page). This will start animating the current 
algorithm. The current path will appear on the grid as a green line branching out from the start cell. 
* If you want to skip the animation, click the green "Quick Run" button to run the algorithm to completion.
* Once the algorithm completes, it will display a message on the page with the total length and weight of the path.

### Grid Cells
<img src="https://github.com/strohs/visual-pathfinding-algorithms/blob/master/images/pathfinding-grid.png" width="200"/>

The cells in the grid are color coded based on their weight:
* white cells (weight = 1)
* blue cells range in weight from 2 to 9, with lighter colored cells having lower weight
* black cells (a.k.a **obstacle cells**) have a weight = 100


### Buttons
Beneath the navbar are 4 buttons that are used to start/stop and restart the currently selected algorithm: 

<img src="https://github.com/strohs/visual-pathfinding-algorithms/blob/master/images/buttons.png" width="300"/>

* the blue play button starts and pauses the current algorithm animation
* the green "Quick Run" is used to run the currently selected algorithm to completion, skipping all animation
* the "Restart" button... clears internal algorithm state (but NOT cell weights) and restarts the algorithm.
* the "Clear Weights" button clears all cells weights and resets them to white cells (with a weight of 1)

### Sliders
<img src="https://github.com/strohs/visual-pathfinding-algorithms/blob/master/images/sliders.png" width="300"/>

* **Animation Speed** controls the refresh rate when animating a pathfinding algorithm
* **Grid Size** changes the size of the grid (10x10 to 100x100)
* **Random Obstacle Cells** is a quick way to generate a percentage of random obstacle cells. 
Move it all the way to the left to clear all obstacle cells. (You can still draw them manually if needed)  
* **Cell Weight** slider is used to set the weight (and color) of cells when you left click a cell on the grid.


## Algorithms
This application currently implements four pathfinding algorithms. A*, Dijkstra's, Breadth First Search (BFS), and 
Depth First Search (DFS).

A* and Dijkstra are shortest path first algorithms. They both take cell weights into account and will attempt to 
find the **lowest cost path** to the goal node, not necessarily the most direct path.

My implementation of Breadth First Search and Depth First Search both ignore cell weights, except for "obstacle" cells. 
They will always path around obstacle cells when finding a route to the goal cell. They are essentially
"brute force" algorithms that stop once they hit the goal cell, or once they have explored every cell on the grid. 


* Dijkstra's Algorithm - is a shortest path first algorithm. It's a breadth first search that finds the smallest 
cost (lowest total weight) path between two nodes on a graph. It typically uses a min-priority queue for storing 
nodes sorted by distance from the start node. My implementation follows this approach but stores nodes in an 
array that is sorted by minimum weight from the start node.
* A-Star (A*) - A* is a variation of Dijkstra's algorithm. Like Dijkstra's, it attempts to find the shortest path 
to a goal node (cell), having the smallest cost (i.e. lowest total weight). Unlike Dijkstra's algorithm, A* uses a 
heuristic function to help guide it towards the goal cell. This application uses the euclidian distance from the 
current cell to the goal cell as its heuristic function. You should be able to see this when viewing the final path, as
it will take a more direct route to the goal cell, (assuming all cells are weighted equally)
* Breadth First Search - the application uses the standard breadth first search that ignores cell weights (except for
obstacle cells). As new cells are encountered they are added to the back of a queue and removed from the front. This 
causes the grid to be explored level by level in a radial pattern from the start cell. 
* Depth First Search - Like BFS, I'm using a standard depth first search that ignores cell weights (except for
obstacle cells). As new cells are encountered they are pushed onto a stack and then popped off. This 
causes the cells to be explored as far as possible before backtracking. When visualized with this application, it will 
appear as if cells are being explored column by column. I've included it mainly for demonstration purposes.



