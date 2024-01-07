'use strict';

import * as PIXI from 'https://cdn.jsdelivr.net/npm/pixi.js@7.3.3/+esm';

window.addEventListener("load", () => {
    var myCanvas, renderer, container;
    var textures = [];
    var pixels = [];

    var frames = 0;
    var world;
    function loop() {
        if (g_once) {
            try {
                // Create the world
                world = g_nextWorld({
                    width: Math.floor(window.innerWidth / g_options.cellSize),
                    height: Math.floor(window.innerHeight / g_options.cellSize),
                    cellSize: g_options.cellSize
                });

                // Update stats
                g_stats.cellCount = world.width * world.height;

                // Get the canvas
                myCanvas = myCanvas || document.getElementById('my-canvas');
                myCanvas.width = world.cellSize * world.width;
                myCanvas.height = world.cellSize * world.height;

                // Create the renderer
                renderer = renderer || new PIXI.autoDetectRenderer({
                    width: myCanvas.width,
                    height: myCanvas.height,
                    view: myCanvas,
                    backgroundAlpha: 0,
                    antialias: true
                });
                renderer.resize(myCanvas.width, myCanvas.height);

                // Create the root of the scene graph
                container = container || new PIXI.Container();

                // Create the textures
                for (let cellType of world.cellTypes) {
                    let textureCanvas = document.createElement('canvas');
                    textureCanvas.width = world.cellSize * cellType.getPalette().length;
                    textureCanvas.height = world.cellSize;

                    let textureCtx = textureCanvas.getContext('2d');
                    for (let i = 0; i < cellType.getPalette().length; i++) {
                        textureCtx.fillStyle = 'rgba(' + cellType.getPalette()[i] + ')';
                        textureCtx.fillRect(i * world.cellSize, 0, world.cellSize, world.cellSize);
                    }

                    let baseTexture = PIXI.BaseTexture.from(textureCanvas);

                    for (let i = 0; i < cellType.getPalette().length; i++) {
                        // Reuse existing texture if possible
                        if (textures[cellType] === undefined) {
                            textures[cellType] = [];
                        }
                        if (textures[cellType][i] === undefined) {
                            textures[cellType][i] = (new PIXI.Texture(baseTexture, new PIXI.Rectangle(i * world.cellSize, 0, world.cellSize, world.cellSize)));
                        } else {
                            textures[cellType][i].baseTexture = baseTexture;
                            textures[cellType][i].frame = new PIXI.Rectangle(i * world.cellSize, 0, world.cellSize, world.cellSize);
                        }
                    }
                }

                drawGrid(pixels, world, container, textures);

                myCanvas.style.backgroundColor = 'white';

                g_stats.timeStart = Date.now();
            } catch (ex) {
                console.error(ex);
            }
            g_once = false;
        }
        // Limit speed of simulation
        if (frames % g_options.invStepFrames === 0) {
            let start = performance.now();
            world.step();
            updateGrid(pixels, world, textures);
            renderer.render(container);
            let end = performance.now();
            g_stats.fps = 1000 / (end - start);
        }
        g_stats.timeElapsed = Date.now() - g_stats.timeStart;

        requestAnimationFrame(loop);

        frames++;
    };

    requestAnimationFrame(loop);
});

window.addEventListener("resize", () => {
    g_once = true;
});

function drawGrid(pixels, world, container, textures) {
    try {
        container.removeChildren();
    } catch (ex) {
        console.error(ex);
    }
    for (let y = 0; y < world.height; y++) {
        for (let x = 0; x < world.width; x++) {
            let sprite = pixels[x + y * world.width];
            // Reuse existing sprite if possible
            if (sprite === undefined) {
                sprite = new PIXI.Sprite(textures[0]);
            } else {
                sprite.texture = textures[0];
            }
            pixels[x + y * world.width] = sprite;
            sprite.x = x * world.cellSize;
            sprite.y = y * world.cellSize;
            container.addChild(sprite);
        }
    }
}

function updateGrid(pixels, world, textures) {
    for (let y = 0; y < world.height; y++) {
        for (let x = 0; x < world.width; x++) {
            let cell = world.grid[y][x];
            let newColor = cell.getColor();
            if (newColor !== world.grid[y][x].oldColor) {
                pixels[x + y * world.width].texture = textures[cell.constructor][newColor];
                world.grid[y][x].oldColor = newColor;
            }
        }
    }
}