'use strict';

class CACellCyclic extends CACell {
    static PALETTE = [
        '255,0,0,1', '255,96,0,1', '255,191,0,1', '223,255,0,1',
        '128,255,0,1', '32,255,0,1', '0,255,64,1', '0,255,159,1',
        '0,255,255,1', '0,159,255,1', '0,64,255,1', '32,0,255,1',
        '127,0,255,1', '223,0,255,1', '255,0,191,1', '255,0,96,1'
    ];

    constructor(locX, locY) {
        super(locX, locY);
        this.state = Math.floor(Math.random() * 16);
    };

    getColor() {
        return this.state;
    };

    static getPalette() {
        return CACellCyclic.PALETTE;
    };

    process(neighbors) {
        var next = (this.state + Math.floor(Math.random() * 2)) % 16;

        var changing = false;
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i] !== null) {
                changing = changing || neighbors[i].state === next;
            }
        }
        if (changing) this.state = next;
        return true;
    };
};

function initCyclicWorld(options) {
    var world = new CAWorld(options);

    world.initialize([
        { class: CACellCyclic, distribution: 100 }
    ]);

    world.cellTypes = [
        CACellCyclic
    ]

    return world;
};