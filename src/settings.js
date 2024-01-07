'use strict';

import { Pane } from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/+esm';

const pane = new Pane({
    title: 'Cellular Automata',
    expanded: true
});

const paneTab = pane.addTab({
    pages: [
        { title: 'Settings' },
        { title: 'About' },
    ]
});

paneTab.pages[1].addBlade({
    view: 'text',
    label: 'Author',
    value: 'Vadym Tytan',
    parse: (v) => String(v),
    readonly: true
}).controller.valueController.view.inputElement.readOnly = true;

paneTab.pages[1].addBlade({
    view: 'text',
    label: 'License',
    value: 'MIT License',
    parse: (v) => String(v),
    readonly: true
}).controller.valueController.view.inputElement.readOnly = true;

paneTab.pages[1].addButton({
    label: 'Source Code',
    title: 'GitHub',
}).on('click', () => {
    window.open('https://github.com/playday3008/CelluAuto');
});

paneTab.pages[0].addBlade({
    view: 'list',
    label: 'Rules',
    options: [
        { text: 'Caves', value: initCavesWorld },
        { text: 'Caves with Water', value: initCavesWithWaterWorld },
        { text: 'Cyclic', value: initCyclicWorld },
        { text: 'Forest Fire', value: initForestFireWorld },
        { text: 'Game of Life', value: initGameOfLifeWorld },
        { text: 'Maze', value: initMazeWorld },
        { text: 'Rain', value: initRainWorld },
    ],
    value: initCavesWithWaterWorld
}).on('change', (ev) => {
    g_nextWorld = ev.value;
    g_once = true;
});

paneTab.pages[0].addBlade({ view: 'separator' });

paneTab.pages[0].addBinding(g_options, 'stepFrames', {
    label: 'Speed of simulation',
    min: 0,
    max: 1,
    step: 1 / 18,
}).on('change', () => {
    g_options.invStepFrames = Math.floor(1 / g_options.stepFrames);
});

paneTab.pages[0].addBinding(g_options, 'cellSize', {
    label: 'Cell size',
    min: 5,
    max: 50,
    step: 1
}).on('change', () => {
    g_once = true;
});

paneTab.pages[0].addButton({
    title: 'Reload',
}).on('click', () => {
    g_once = true;
});

paneTab.pages[0].addBlade({ view: 'separator' });

const statPane = paneTab.pages[0].addFolder({
    title: 'Statistics',
    expanded: true
});

statPane.addBinding(g_stats, 'fps', {
    label: 'FPS',
    interval: 100,
    readonly: true
});

statPane.addBinding(g_stats, 'timeElapsed', {
    label: 'Time elapsed',
    format: (value) => {
        return value.toFixed(0) + ' ms';
    },
    readonly: true
});

statPane.addBinding(g_stats, 'cellCount', {
    label: 'Cell count',
    interval: 1000,
    format: (value) => {
        return value.toFixed(0);
    },
    readonly: true
});