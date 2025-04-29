"use strict";

/* global XXH */

let worldSeed1;
let canvas1;
let flowerColors = [];
let numCols1 = 32;
let numRows1 = 32;
let grid1 = [];

function setup() {
  // Canvas 1 - attach to #canvas-container-1
  canvas1 = createCanvas(512, 512);
  canvas1.parent("canvas-container-1");

  // Predefine flower colors
  flowerColors = [
    color(140, 190, 255),
    color(160, 210, 255),
    color(180, 220, 255),
    color(120, 170, 230),
    color(100, 160, 220),
    color(80, 140, 200)
  ];

  // Start with default world key
  worldKeyChanged1("default");

  // Hook reseed button
  select("#reseedButton1").mousePressed(() => {
    let newKey = select("#seedInput1").value(); // Now from separate input box
    worldKeyChanged1(newKey);
  });

  noLoop(); // Only draw when world changes
}

function draw() {
  background(180, 220, 255);
  drawWorld1();
}

function worldKeyChanged1(key) {
  worldSeed1 = XXH.h32(key, 0);
  noiseSeed(worldSeed1);
  randomSeed(worldSeed1);

  generateWorld1();
  redraw();
}

function generateWorld1() {
  grid1 = [];
  for (let y = 0; y < numRows1; y++) {
    let row = [];
    for (let x = 0; x < numCols1; x++) {
      let n = noise(x * 0.1, y * 0.1);
      row.push(n > 0.55 ? "F" : ".");
    }
    grid1.push(row);
  }
}

function drawWorld1() {
  let tileW = width / numCols1;
  let tileH = height / numRows1;

  for (let y = 0; y < numRows1; y++) {
    for (let x = 0; x < numCols1; x++) {
      if (grid1[y][x] === "F") {
        fill(random(flowerColors));
        noStroke();
        ellipse(x * tileW + tileW / 2, y * tileH + tileH / 2, tileW * 0.7, tileH * 0.7);
      }
    }
  }
}
