'use strict';

// CACellLiving is defined in examples/gameOfLife.js, so we don't need to redefine it here

class CACellMaze extends CACellLiving {
    constructor(locX, locY) {
        super(locX, locY);
        this.simulated = 0;
    }

    process(neighbors) {
        var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');

        if (this.simulated < 20) {
            this.alive = surrounding === 1 || surrounding === 2 && this.alive;
        }
        if (this.simulated > 20 && surrounding == 2) {
            this.alive = true;
        }
        this.simulated += 1;
    };
};

function initMazeWorld(options) {
    var world = new CAWorld(options);

    world.initialize([
        { class: CACellMaze, distribution: 100 }
    ]);

    world.cellTypes = [
        CACellMaze
    ];

    return world;
};