'use strict';

class CACellLiving extends CACell {
    static PALETTE = [
        '68, 36, 52, 1',
        '255, 255, 255, 1'
    ];

    constructor(locX, locY) {
        super(locX, locY);
        this.alive = Math.random() > 0.5;
    };

    getColor() {
        return this.alive ? 0 : 1;
    };

    static getPalette() {
        return CACellLiving.PALETTE;
    };

    process(neighbors) {
        var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasAlive');
        this.alive = surrounding === 3 || (this.alive && surrounding === 2);
    };

    reset() {
        this.wasAlive = this.alive;
    };
};

function initGameOfLifeWorld(options) {
    var world = new CAWorld(options);

    world.initialize([
        { class: CACellLiving, distribution: 100 }
    ]);

    world.cellTypes = [
        CACellLiving
    ]

    return world;
};