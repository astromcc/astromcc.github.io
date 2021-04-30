// A script to interpret mouse clicks and annotate the 2-d plane with
// information about the location of a hidden object.

// Define color variables
let guessColor;
let confColor;
let targetColor;
let bgcolor;
let confalpha = 50;

// Region at edge of box where target is excluded
let boxMargin = 30;
// Size of plotted dots
let dotSize = 12;
// Size of revealed hidden dot
let targetSize = 20;

let target = {
  x: 0,
  y: 0
};

let data = [];

let guesses = [];

let regions = [];

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(600, 600);
  canvas0.parent("p5canvas");

  // Define color for background
  bgColor = color(255);

  // Define color to display guess dots and lines
  guessColor = color(255, 127, 0);

  // Define color to display confidence regions
  confColor = color(0, 0, 127, confalpha);

  // Define color to display hidden "target" dot
  targetColor = color(0, 240, 0);

  background(bgColor);

  // Define rect() with opposite corners instead of x,y,width,height
  rectMode(CORNERS);

  // Get location of new hidden target, assigned to bayes.target
  newTarget();
}

// Define a new target position to search for, some distance from box edges
function newTarget() {
  target.x = random(boxMargin, width - boxMargin);
  target.y = random(boxMargin, height - boxMargin);
}

// Define a new data point anywhere in the box
function newPoint() {
  return [random(0, width), random(0, height)];
}

// No need for a draw function, everything is based on user input
function draw() {}

// User mouse click on canvas marks a new guess
function mouseClicked() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    guesses.push([mouseX, mouseY]);
    updateBox();
  }
}

function updateBox() {
  background(bgColor);
  drawRegions();
  drawData();
  drawGuesses();
}

function chooseRegion(x, y) {
  // Define shorthand for the target x,y
  tx = target.x;
  ty = target.y;
  // Determine which of four regions the hidden point is in.
  // Then add that region to the bayes.regions list.
  if (x >= tx && y >= ty) {
    return [px, py, 0, 0];
  } else if (x >= tx && y < ty) {
    return [px, py, 0, height];
  } else if (x < tx && y >= ty) {
    return [px, py, width, 0];
  } else if (x < tx && y < ty) {
    return [px, py, width, height];
  }
}

function drawRegions() {
  noStroke();
  fill(confColor);
  for (let r = 0; r < regions.length; r++) {
    rect(regions[r][0], regions[r][1], regions[r][2], regions[r][3]);
  }
}

function drawData() {
  fill(0);
  noStroke();
  for (let d = 0; d < data.length; d++) {
    ellipse(data[d][0], data[d][1], dotSize / 2, dotSize / 2);
  }
}

function drawGuesses() {
  let ng = guesses.length;
  if (ng == 1) {
    fill(guessColor);
    strokeWeight(0);
    ellipse(guesses[0][0], guesses[0][1], dotSize, dotSize);
  } else if (ng > 1) {
    // Draw a small dot for the previous guesses
    for (let d = 0; d < ng - 1; d++) {
      fill(guessColor);
      strokeWeight(0);
      ellipse(guesses[d][0], guesses[d][1], dotSize / 2, dotSize / 2);
    }
    // Draw a big dot for the last guess
    fill(guessColor);
    strokeWeight(0);
    ellipse(guesses[ng - 1][0], guesses[ng - 1][1], dotSize, dotSize);
  }
}

function drawTarget() {
  noStroke();
  fill(targetColor);
  tris = 10;
  triangle(target.x, target.y - tris,
    target.x - 0.866 * tris, target.y + 0.5 * tris,
    target.x + 0.866 * tris, target.y + 0.5 * tris);
}

let measure = function() {
  tx = target.x;
  ty = target.y;
  [px, py] = newPoint();
  data.push([px, py]);
  regions.push(chooseRegion(px, py));
  confalpha = confalpha * (0.96 - 0.0005 * data.length);
  confColor = color(0, 0, 127, confalpha);
  updateBox();
}

let reveal = function() {
  drawTarget();
}

let restart = function() {
  newTarget();
  data = [];
  guesses = [];
  regions = [];
  confalpha = 50;
  background(bgColor);
}