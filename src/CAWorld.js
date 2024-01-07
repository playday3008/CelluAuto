'use strict';

class CAWorld {
    // This is a list of the 8 neighbors of a cell with their index, x and y offsets from the cell
    /* beautify preserve:start */
    static TOPLEFT =     { index: 0, x: -1, y: -1 };
    static TOP =         { index: 1, x:  0, y: -1 };
    static TOPRIGHT =    { index: 2, x:  1, y: -1 };
    static LEFT =        { index: 3, x: -1, y:  0 };
    static RIGHT =       { index: 4, x:  1, y:  0 };
    static BOTTOMLEFT =  { index: 5, x: -1, y:  1 };
    static BOTTOM =      { index: 6, x:  0, y:  1 };
    static BOTTOMRIGHT = { index: 7, x:  1, y:  1 };
    /* beautify preserve:end */

    // Static array of the 8 neighbors, for ease of iteration over all neighbors
    static NEIGHBORLOCS = [
        CAWorld.TOPLEFT,
        CAWorld.TOP,
        CAWorld.TOPRIGHT,
        CAWorld.LEFT,
        CAWorld.RIGHT,
        CAWorld.BOTTOMLEFT,
        CAWorld.BOTTOM,
        CAWorld.BOTTOMRIGHT
    ];

    // Reusable array for holding the neighbors of a cell
    neighborhood = [null, null, null, null, null, null, null, null];

    constructor(options) {
        options = options || {};
        this.width = options.width || 144;
        this.height = options.height || 96;
        this.cellSize = options.cellSize || 6;
    };

    // Builds a pattern of neighbors around the given cell
    fillNeighbors(x, y) {
        for (let i = 0; i < CAWorld.NEIGHBORLOCS.length; i++) {
            let neighborX = x + CAWorld.NEIGHBORLOCS[i].x;
            let neighborY = y + CAWorld.NEIGHBORLOCS[i].y;
            if (neighborX < 0 || neighborY < 0 || neighborX >= this.width || neighborY >= this.height) {
                this.neighborhood[i] = null;
            }
            else {
                this.neighborhood[i] = this.grid[neighborY][neighborX];
            }
        }
    };

    // This is used to make the simulation run one loop. Typically you would run step from setInterval or requestAnimationFrame.
    step() {
        let y, x;
        for (y = 0; y < this.height; y++) {
            for (x = 0; x < this.width; x++) {
                this.grid[y][x].reset();
            }
        }

        // Bottom up and left to right processing
        for (y = this.height - 1; y >= 0; y--) {
            for (x = this.width - 1; x >= 0; x--) {
                this.fillNeighbors(x, y);
                let cell = this.grid[y][x];
                cell.process(this.neighborhood);
            }
        }
    };

    // Initializes the world with a list of cell types and their distribution
    initialize(arrayTypeDist) {
        // Sort the cell types by distribution
        arrayTypeDist.sort((a, b) => {
            return a.distribution > b.distribution ? 1 : -1;
        });

        let totalDist = 0;
        // Add all distributions together
        for (let i = 0; i < arrayTypeDist.length; i++) {
            totalDist += arrayTypeDist[i].distribution;
            arrayTypeDist[i].distribution = totalDist;
        }

        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                let random = Math.random() * 100;

                for (let i = 0; i < arrayTypeDist.length; i++) {
                    if (random <= arrayTypeDist[i].distribution) {
                        // Invoke the constructor of the cell type
                        this.grid[y][x] = new arrayTypeDist[i].class(x, y);
                        break;
                    }
                }
            }
        }
    };

    // Creates a grid of values which can be used as input for a new world. In this way, we can build our simulated world in several iterations.
    createGridFromValues(values, defaultValue) {
        let newGrid = [];

        for (let y = 0; y < this.height; y++) {
            newGrid[y] = [];
            for (let x = 0; x < this.width; x++) {
                newGrid[y][x] = defaultValue;
                let cell = this.grid[y][x];
                for (let i = 0; i < values.length; i++) {
                    if (cell instanceof values[i].class && Object.hasOwn(cell, values[i].hasProperty) && cell[values[i].hasProperty]) {
                        newGrid[y][x] = values[i].value;
                    }
                }
            }
        }

        return newGrid;
    };

    // Accepts a grid generated with "createGridFromValues" and a list of what values mean which cell classes in this new simulated world.
    initializeFromGrid(values, initGrid) {
        this.grid = [];

        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                for (let i = 0; i < values.length; i++) {
                    if (values[i].gridValue === initGrid[y][x]) {
                        // Invoke the constructor of the cell type
                        this.grid[y][x] = new values[i].class(x, y);
                        break;
                    }
                }
            }
        }
    };
};