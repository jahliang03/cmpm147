/* exported preload, setup, draw, placeTile */
/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function setup() {
  const asciiBox = select("#asciiBox");

  numRows = int(asciiBox.attribute("rows"));
  numCols = int(asciiBox.attribute("cols"));

  const canvas = createCanvas(16 * numCols, 16 * numRows);
  canvas.parent("canvas-container"); // ✅ Matches your HTML

  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  asciiBox.input(reparseGrid);

  reseed();
}

function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  const grid = generateGrid(numCols, numRows);
  select("#asciiBox").value(gridToString(grid));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  return grid.map(row => row.join("")).join("\n");
}

function stringToGrid(str) {
  return str.split("\n").map(line => line.split(""));
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}
/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push(random() < 0.1 ? "T" : "G");
    }
    grid.push(row);
  }

  let roomWidth = floor(random(5, numCols - 2));
  let roomHeight = floor(random(5, numRows - 2));
  let startX = floor(random(1, numCols - roomWidth - 1));
  let startY = floor(random(1, numRows - roomHeight - 1));

  for (let i = startY; i < startY + roomHeight; i++) {
    for (let j = startX; j < startX + roomWidth; j++) {
      let n = noise(i * 0.3, j * 0.3);
      if (n > 0.45) {
        grid[i][j] = "W";
      }
    }
  }

  return grid;
}

function drawGrid(grid) {
  background(128);
  noStroke();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let code = grid[i][j];

      if (code === "G") {
        placeTile(i, j, floor(random(1, 4)), 0);
        let shadow = map(noise(i * 0.1, j * 0.1, millis() / 3000), 0, 1, 0, 80);
        fill(0, 0, 0, shadow);
        rect(j * 16, i * 16, 16, 16);
        let brightness = map(noise(i * 0.1, j * 0.1, millis() / 5000), 0, 1, 0, 60);
        fill(255, 255, 150, brightness);
        rect(j * 16, i * 16, 16, 16);
      } else if (code === "T") {
        placeTile(i, j, 15, 0);
      } else if (code === "W") {
        placeTile(i, j, 1, 13);
        drawWaterEdge(grid, i, j);
      } else {
        placeTile(i, j, 15, 0);
      }
    }
  }
}

function drawWaterEdge(grid, i, j) {
  const isWater = (x, y) => gridCheck(grid, x, y, "W");

  if (!isWater(i - 1, j)) placeTile(i, j, 10, 0);
  if (!isWater(i, j + 1)) placeTile(i, j, 11, 1);
  if (!isWater(i + 1, j)) placeTile(i, j, 10, 2);
  if (!isWater(i, j - 1)) placeTile(i, j, 9, 1);
}

function gridCheck(grid, i, j, target) {
  return (
    i >= 0 &&
    i < grid.length &&
    j >= 0 &&
    j < grid[0].length &&
    grid[i][j] === target
  );
}
