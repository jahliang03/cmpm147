
let tilesetImage;

function gridToString(grid) {
  return grid.map(row => row.join("")).join("\n");
}

function stringToGrid(str) {
  return str.split("\n").map(line => line.split(""));
}

function placeTile(p, i, j, ti, tj) {
  p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

function drawWaterEdge(p, grid, i, j) {
  const isWater = (x, y) =>
    x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] === "W";
  if (!isWater(i - 1, j)) placeTile(p, i, j, 10, 0);
  if (!isWater(i, j + 1)) placeTile(p, i, j, 11, 1);
  if (!isWater(i + 1, j)) placeTile(p, i, j, 10, 2);
  if (!isWater(i, j - 1)) placeTile(p, i, j, 9, 1);
}

// === OVERWORLD ===
const overworld = (p) => {
  let grid = [], seed = 0, numCols = 20, numRows = 20;

  p.preload = () => {
    tilesetImage = p.loadImage("https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438");
  };

  p.setup = () => {
    p.createCanvas(16 * numCols, 16 * numRows).parent("canvas-container-1");
    document.getElementById("reseedButton1").onclick = () => reseed();
    document.getElementById("asciiBox1").oninput = () => reparse();
    reseed();
  };

  p.draw = () => {
    p.randomSeed(seed);
    drawGridOverworld(p, grid);
  };

  function reseed() {
    seed += 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    document.getElementById("seedReport1").textContent = "Seed: " + seed;
    grid = generateOverworld(numCols, numRows);
    document.getElementById("asciiBox1").value = gridToString(grid);
  }

  function reparse() {
    grid = stringToGrid(document.getElementById("asciiBox1").value);
  }
};

function generateOverworld(cols, rows) {
  let grid = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push(Math.random() < 0.1 ? "T" : "G");
    }
    grid.push(row);
  }

  // Add a water blob using noise
  let roomWidth = Math.floor(Math.random() * 10) + 5;
  let roomHeight = Math.floor(Math.random() * 10) + 5;
  let startX = Math.floor(Math.random() * (cols - roomWidth));
  let startY = Math.floor(Math.random() * (rows - roomHeight));
  for (let i = startY; i < startY + roomHeight; i++) {
    for (let j = startX; j < startX + roomWidth; j++) {
      if (Math.random() > 0.3) grid[i][j] = "W";
    }
  }
  return grid;
}

function drawGridOverworld(p, grid) {
  p.background(128);
  p.noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let code = grid[i][j];

      if (code === "G") {
        placeTile(p, i, j, 1, 0);

        // Animate shadow
        let shadow = p.map(p.noise(i * 0.1, j * 0.1, p.millis() / 3000), 0, 1, 0, 80);
        p.fill(0, 0, 0, shadow); // semi-transparent dark overlay
        p.rect(j * 16, i * 16, 16, 16);

        // Animate brightness (sunlight flicker)
        let brightness = p.map(p.noise(i * 0.1, j * 0.1, p.millis() / 5000), 0, 1, 0, 60);
        p.fill(255, 255, 200, brightness); // soft yellow-white highlight
        p.rect(j * 16, i * 16, 16, 16);
      }

      else if (code === "T") {
        placeTile(p, i, j, 15, 0);
      }

      else if (code === "W") {
        placeTile(p, i, j, 1, 13);
        drawWaterEdge(p, grid, i, j);
      }
    }
  }
}
function drawWaterEdge(p, grid, i, j) {
  const isWater = (x, y) =>
    x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] === "W";

  if (!isWater(i - 1, j)) placeTile(p, i, j, 10, 0); // top edge
  if (!isWater(i, j + 1)) placeTile(p, i, j, 11, 1); // right edge
  if (!isWater(i + 1, j)) placeTile(p, i, j, 10, 2); // bottom edge
  if (!isWater(i, j - 1)) placeTile(p, i, j, 9, 1); // left edge
}

// === DUNGEON ===
const dungeon = (p) => {
  let grid = [], seed = 0, numCols = 20, numRows = 20;

  p.preload = () => {
    tilesetImage = p.loadImage("https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438");
  };

  p.setup = () => {
    p.createCanvas(16 * numCols, 16 * numRows).parent("canvas-container-2");
    document.getElementById("reseedButton2").onclick = () => reseed();
    document.getElementById("asciiBox2").oninput = () => reparse();
    reseed();
  };

  p.draw = () => {
    p.randomSeed(seed);
    drawGridDungeon(p, grid);
  };

  function reseed() {
    seed += 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    document.getElementById("seedReport2").textContent = "Seed: " + seed;
    grid = generateDungeon(numCols, numRows);
    document.getElementById("asciiBox2").value = gridToString(grid);
  }

  function reparse() {
    grid = stringToGrid(document.getElementById("asciiBox2").value);
  }
};

function generateDungeon(cols, rows) {
  let grid = Array.from({ length: rows }, () => Array(cols).fill("G"));
  let y = Math.floor(rows / 2), pathHeight = 5;

  for (let x = 0; x < cols; x++) {
    for (let h = 0; h < pathHeight; h++) {
      let yy = y + h - Math.floor(pathHeight / 2);
      if (yy >= 0 && yy < rows) grid[yy][x] = "W";
    }
    if (Math.random() < 0.4) {
      let dy = Math.floor(Math.random() * 3) - 1;
      let newY = y + dy;
      if (newY - 2 >= 0 && newY + 2 < rows) y = newY;
    }
  }

  let doors = Math.floor(Math.random() * 4) + 1, placed = 0;
  while (placed < doors) {
    let i = Math.floor(Math.random() * (rows - 2)) + 1;
    let j = Math.floor(Math.random() * (cols - 2)) + 1;
    if (grid[i][j] === "G" && (
      grid[i-1][j] === "W" || grid[i+1][j] === "W" || grid[i][j-1] === "W" || grid[i][j+1] === "W"
    )) {
      grid[i][j] = "T";
      placed++;
    }
  }

  return grid;
}

function drawGridDungeon(p, grid) {
  p.background(128);
  p.noStroke();
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let code = grid[i][j];
      if (code === "G"){
        placeTile(p, i, j, 11, 23);
        // Animate shadow
        let shadow = p.map(p.noise(i * 0.4, j * 0.4, p.millis() / 3000), 0, 1, 0, 80);
        p.fill(0, 0, 0, shadow); // semi-transparent dark overlay
        p.rect(j * 30, i * 30, 30, 30);

      }

      else if (code === "T"){
         placeTile(p, i, j, 15, 25);
      }
      else if (code === "W") {
        placeTile(p, i, j, 30, 25);
        drawPathEdge(p, grid, i, j);
      }
    }
  }
}

function drawPathEdge(p, grid, i, j) {
  const isWater = (x, y) =>
    x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] === "W";

  // These tile coordinates should point to *subtle* dungeon edges, not green-highlighted ones.
  if (!isWater(i - 1, j)) placeTile(p, i, j, 16, 21); // top edge
  if (!isWater(i, j + 1)) placeTile(p, i, j, 17, 22); // right edge
  if (!isWater(i + 1, j)) placeTile(p, i, j, 16, 23); // bottom edge
  if (!isWater(i, j - 1)) placeTile(p, i, j, 15, 22); // left edge
}


new p5(overworld);
new p5(dungeon);
