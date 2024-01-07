'use strict';

class CACell {
    constructor(locX, locY) {
        this.x = locX;
        this.y = locY;
    };

    // This function is called every step of the simulation and is passed an array of neighbors to this cell.
    process(neighbors) {
        // Virtual function, do nothing by default
        console.warn('CACell.process() not implemented');
        debugger;
        return;
    };

    // This function is called at the beginning of each step of the simulation to prepare the cell for the upcoming step.
    reset(neighbors) {
        // Virtual function, do nothing by default
        // It is OK to not implement this function if you don't need it.
        return;
    };

    // This is our own function for determining what color the cell will be.
    getColor() {
        // Virtual function, do nothing by default
        console.warn('CACell.getColor() not implemented');
        debugger;
        return 0;
    };

    // This is our own function for getting the palette of colors for the cell.
    static getPalette() {
        // Virtual function, do nothing by default
        console.warn('CACell.getPalette() not implemented');
        debugger;
        return [];
    }

    // Returns a count of members of the given cell array that contain the given propery.
    countSurroundingCellsWithValue(neighbors, value) {
        let surrounding = 0;
        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i] !== null && Object.hasOwn(neighbors[i], value) && neighbors[i][value]) {
                surrounding++;
            }
        }
        return surrounding;
    };
};