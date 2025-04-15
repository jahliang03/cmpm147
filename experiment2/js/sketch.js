// sketch.js - beach scene setup and draw
// Author: Jasmine Liang
// Date: 2025-04-14

let seed = 200;
let sunStartTime = 0;
let canvasContainer;

const oceanColor = "#86a0be";
const sandColor = "#747f89";
const skyColor = "#b9d4ed";
const mountainColor = "#283948";
const sunColor = "#ffffd0";
const cloudColor = "#f4f8f8";
const cloudColor2 = "#afc9e1";
const cloudColor3 = "#ffd9b0";
const waveColor = "#b3cfec";
const waveColor2 = "#91b8db";
const waveColor3 = "#5c758a";

let cloudPositions = [];
let cloudPositions2 = [];
let cloudPositions3 = [];

function setup() {
  canvasContainer = select('#canvas-container');
  let canvas = createCanvas(400, 200);
  canvas.parent(canvasContainer);

  createButton("reimagine").parent(canvasContainer).mousePressed(() => {
    seed++;
    sunStartTime = millis();
    initClouds();
  });

  initClouds();
  sunStartTime = millis(); // Start sun movement
}

function draw() {
  randomSeed(seed);
  background(100);
  noStroke();
  fill(skyColor);
  rect(0, 0, width, height / 2);

  drawClouds();

  stroke(cloudColor3);
  strokeWeight(2);
  fill(sunColor);
  let elapsed = (millis() - sunStartTime) % 20000;
  let time = elapsed / 40000;
  let sunY = map(time, 0, 1, height / 4, height + 50);
  circle(width / 2, sunY, 50);

  fill(sandColor);
  rect(0, height - height / 5, width, height / 5);

  drawOcean();

  stroke("#ffa480");
  strokeWeight(2);
  fill(mountainColor);
  beginShape();
  vertex(0, height / 2);
  const steps = 10;
  for (let i = 0; i < steps + 1; i++) {
    let x = (width * i) / steps;
    let y = height / 2 - (random() * random() * random() * height) / 4 - height / 50;
    vertex(x, y);
  }
  vertex(width, height / 2);
  endShape(CLOSE);
}

function initClouds() {
  cloudPositions = [];
  cloudPositions2 = [];
  cloudPositions3 = [];

  for (let i = 0; i < 5; i++) {
    cloudPositions.push({
      x: random(width),
      y: random(10, height / 4),
      speed: random(0.2, 0.5),
      size: random(30, 50),
    });

    cloudPositions2.push({
      x: random(width),
      y: random(height / 3, height / 2 - 5),
      speed: random(0.2, 0.5),
      size: random(50, 60),
    });

    cloudPositions3.push({
      x: random(width),
      y: random(height / 2 - 10, height / 2 + 10),
      speed: random(0.15, 0.4),
      size: random(40, 55),
    });
  }
}

function drawClouds() {
  // Top Layer
  fill(cloudColor);
  cloudPositions.forEach(cloud => {
    cloud.x += cloud.speed;
    if (cloud.x > width + 60) cloud.x = -60;
    let baseX = cloud.x, baseY = cloud.y, w = cloud.size * 2, h = cloud.size * 0.4;
    ellipse(baseX, baseY, w, h);
    ellipse(baseX + 20, baseY - 8, w * 0.8, h);
    ellipse(baseX + 40, baseY + 4, w * 0.7, h);
    ellipse(baseX - 20, baseY + 6, w * 0.6, h);
    ellipse(baseX + 10, baseY + 10, w * 0.5, h * 0.6);
  });

  // Middle Layer
  fill(cloudColor2);
  cloudPositions2.forEach(cloud => {
    cloud.x += cloud.speed;
    if (cloud.x > width + 60) cloud.x = -60;
    let baseX = cloud.x, baseY = cloud.y, w = cloud.size * 2, h = cloud.size * 0.5;
    ellipse(baseX, baseY, w, h);
    ellipse(baseX + 20, baseY - 6, w * 0.8, h * 0.8);
    ellipse(baseX + 35, baseY + 4, w * 0.7, h * 0.7);
    ellipse(baseX - 15, baseY + 4, w * 0.6, h * 0.7);
  });

  // Bottom Layer
  fill(cloudColor3);
  cloudPositions3.forEach(cloud => {
    cloud.x += cloud.speed;
    if (cloud.x > width + 60) cloud.x = -60;
    let baseX = cloud.x, baseY = cloud.y, w = cloud.size * 2, h = cloud.size * 0.4;
    ellipse(baseX, baseY, w, h);
    ellipse(baseX + 15, baseY - 5, w * 0.8, h * 0.7);
    ellipse(baseX + 30, baseY + 3, w * 0.7, h * 0.7);
    ellipse(baseX - 15, baseY + 5, w * 0.6, h * 0.6);
    ellipse(baseX + 5, baseY + 8, w * 0.5, h * 0.5);
  });
}

function drawOcean() {
  fill(oceanColor);
  rect(0, height / 2, width, height / 3);

  let numWaveLines = 1, waveGap = 10, waveHeight = 5;

  stroke(waveColor);
  strokeWeight(30);
  noFill();
  for (let j = 0; j < numWaveLines; j++) {
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let angle = millis() / 2000 + x * 0.05 + j;
      let y = (height * 5) / 7 + 20 + j * waveGap + sin(angle) * waveHeight;
      vertex(x, y);
    }
    endShape();
  }

  stroke(waveColor2);
  strokeWeight(20);
  for (let j = 0; j < numWaveLines; j++) {
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let angle = millis() / -2000 + x * 0.05 + j;
      let y = (height * 4.5) / 7 + 20 + j * waveGap + sin(angle) * waveHeight;
      vertex(x, y);
    }
    endShape();
  }

  stroke(waveColor3);
  strokeWeight(18);
  waveHeight = 3;
  for (let j = 0; j < numWaveLines; j++) {
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let angle = millis() / 2000 + x * 0.05 + j;
      let y = (height * 3) / 7 + 20 + j * waveGap + sin(angle) * waveHeight;
      vertex(x, y);
    }
    endShape();
  }
  noStroke();
}
