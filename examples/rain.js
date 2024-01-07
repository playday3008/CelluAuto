'use strict';

// CACellWall is defined in examples/caves.js, so we don't need to redefine it here
// CACellWater is defined in examples/cavesWithWater.js, so we don't need to redefine it here

class CACellAir extends CACellWater {
    constructor(locX, locY) {
        super(locX, locY);
        this.water = 0;
    };

    process(neighbors) {
        if (neighbors[CAWorld.TOP.index] === null && Math.random() < 0.02) {
            this.water = 5;
        }
        else if (this.water === 0) {
            // already empty
            return;
        }
        super.process(neighbors);
    };
};

function initRainWorld(options) {
    // FIRST CREATE CAVES
    var world = new CAWorld(options);

    world.initialize([
        { class: CACellWall, distribution: 100 }
    ]);

    // Generate our cave, 10 steps would be enough
    for (let i = 0; i < 10; i++) {
        world.step();
    }

    var grid = world.createGridFromValues([
        { class: CACellWall, hasProperty: 'open', value: 0 }
    ], 1);

    // Cut the top half of the caves off
    for (var y = 0; y < Math.floor(world.height / 2); y++) {
        for (var x = 0; x < world.width; x++) {
            grid[y][x] = 0;
        }
    }

    // NOW USE OUR CAVES TO CREATE A NEW WORLD CONTAINING WATER
    world = new CAWorld(options);

    // Pass in our generated cave data
    world.initializeFromGrid([
        { class: CACellRock, gridValue: 1 },
        { class: CACellAir, gridValue: 0 }
    ], grid);

    world.cellTypes = [
        CACellAir,
        CACellRock
    ]

    return world;
};