'use strict';

class CACellWall extends CACell {
    static PALETTE = [
        '255, 255, 255, 1',
        '68, 36, 52, 1'
    ];

    constructor(locX, locY) {
        super(locX, locY);
        this.open = Math.random() > 0.40;
    };

    getColor() {
        return this.open ? 0 : 1;
    };

    static getPalette() {
        return CACellWall.PALETTE;
    };

    process(neighbors) {
        let surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasOpen');
        this.open = (this.wasOpen && surrounding >= 4) || surrounding >= 6;
    };

    reset() {
        this.wasOpen = this.open;
    };
};

function initCavesWorld(options) {
    var world = new CAWorld(options);

    world.initialize([
        { class: CACellWall, distribution: 100 }
    ]);

    world.cellTypes = [
        CACellWall
    ]

    return world;
};