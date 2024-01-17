'use strict';

class CACellTree extends CACell {
    static PALETTE = [
        '208, 70, 72, 0',
        '208, 70, 72, ' + 1 / 9,
        '208, 70, 72, ' + 2 / 9,
        '208, 70, 72, ' + 3 / 9,
        '208, 70, 72, ' + 4 / 9,
        '208, 70, 72, ' + 5 / 9,
        '208, 70, 72, ' + 6 / 9,
        '208, 70, 72, ' + 7 / 9,
        '208, 70, 72, ' + 8 / 9,
        '208, 70, 72, 1',
        '52, 101, 36, 1',
        '255, 255, 255, 1'
    ];

    static CHANCE_TO_IGNITE = 0.0001;
    static CHANCE_TO_GROW = 0.01;

    constructor(locX, locY) {
        super(locX, locY);
        this.burning = 0;
    };

    getColor() {
        return this.burning ? this.burning : (this.alive ? 10 : 11);
    };

    static getPalette() {
        return CACellTree.PALETTE;
    };

    process(neighbors) {
        if (this.wasBurning) {
            this.burning -= 3;
        }
        else if (this.alive) {
            var surrounding = this.countSurroundingCellsWithValue(neighbors, 'wasBurning');
            if (surrounding) {
                this.burning = 9;
                this.alive = false;
            }
            else if (Math.random() < CACellTree.CHANCE_TO_IGNITE) {
                this.burning = 9;
                this.alive = false;
            }
        }
        else if (Math.random() < CACellTree.CHANCE_TO_GROW) {
            this.alive = true;
        }
    };

    reset() {
        this.wasBurning = this.burning !== 0;
    };
};

function initForestFireWorld(options) {
    var world = new CAWorld(options);

    world.initialize([
        { class: CACellTree, distribution: 100 }
    ]);

    world.cellTypes = [
        CACellTree
    ];

    return world;
};