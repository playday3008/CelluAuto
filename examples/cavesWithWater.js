'use strict';

// CACellWall is defined in examples/caves.js, so we don't need to redefine it here

class CACellWater extends CACell {
    static PALETTE = [
        '89, 125, 206, 0',
        '89, 125, 206, ' + 1 / 9,
        '89, 125, 206, ' + 2 / 9,
        '89, 125, 206, ' + 3 / 9,
        '89, 125, 206, ' + 4 / 9,
        '89, 125, 206, ' + 5 / 9,
        '89, 125, 206, ' + 6 / 9,
        '89, 125, 206, ' + 7 / 9,
        '89, 125, 206, ' + 8 / 9,
        '89, 125, 206, 1'
    ];

    constructor(locX, locY) {
        super(locX, locY);
        this.water = Math.floor(Math.random() * 9);
    };

    getColor() {
        return this.water;
    };

    static getPalette() {
        return CACellWater.PALETTE;
    };

    process(neighbors) {
        if (this.water === 0) {
            // already empty
            return;
        }
        // push my water out to my available neighbors

        // cell below me will take all it can
        if (neighbors[CAWorld.BOTTOM.index] !== null && this.water && neighbors[CAWorld.BOTTOM.index].water < 9) {
            let amt = Math.min(this.water, 9 - neighbors[CAWorld.BOTTOM.index].water);
            this.water -= amt;
            neighbors[CAWorld.BOTTOM.index].water += amt;
            return;
        }

        // bottom two corners take half of what I have
        for (let i = 5; i <= 7; i++) {
            // 5 is bottom left, 6 is bottom, 7 is bottom right
            // Skip bottom
            if (i == CAWorld.BOTTOM.index) {
                continue;
            }
            if (neighbors[i] !== null && this.water && neighbors[i].water < 9) {
                let amt = Math.min(this.water, Math.ceil((9 - neighbors[i].water) / 2));
                this.water -= amt;
                neighbors[i].water += amt;
                return;
            }
        }
        // sides take a third of what I have
        for (let i = 3; i <= 4; i++) {
            if (neighbors[i] !== null && neighbors[i].water < this.water) {
                let amt = Math.min(this.water, Math.ceil((9 - neighbors[i].water) / 3));
                this.water -= amt;
                neighbors[i].water += amt;
                return;
            }
        }
    };
};

class CACellRock extends CACell {
    static PALETTE = [
        '109, 170, 44, 1',
        '68, 36, 52, 1'
    ];

    constructor(locX, locY) {
        super(locX, locY);
        this.isSolid = true;
    };

    getColor() {
        return this.lighted ? 0 : 1;
    };

    static getPalette() {
        return CACellRock.PALETTE;
    };

    process(neighbors) {
        this.lighted = neighbors[CAWorld.TOP.index] && !(neighbors[CAWorld.TOP.index].water === 9) && !neighbors[CAWorld.TOP.index].isSolid
            && neighbors[CAWorld.BOTTOM.index] && neighbors[CAWorld.BOTTOM.index].isSolid;
    };
};

function initCavesWithWaterWorld(options) {
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

    // NOW USE OUR CAVES TO CREATE A NEW WORLD CONTAINING WATER
    world = new CAWorld(options);

    // Pass in our generated cave data
    world.initializeFromGrid([
        { class: CACellRock, gridValue: 1 },
        { class: CACellWater, gridValue: 0 }
    ], grid);

    world.cellTypes = [
        CACellWater,
        CACellRock
    ]

    return world;
};