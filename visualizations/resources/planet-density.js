// Scale planetary body core using a slider and calculate the bulk density
// of the body based on a simple mixture of rock and metal with densities
// of 8 g/cc and 3 g/cc, respectively.

// Variables for interface
// slider element for Density control
let denslide;
// percent of body volume occupied by metal, 0 - 100
let metpc;

// Earth is the default body to display when the page loads.
let currentBody = "eart";
let bodyNum = 2;

// Arrays to hold globe and core images
bodies = [];
cores = [];

// Arrays to hold button id's
names = ["merc", "venu", "eart", "moon", "mars"];

// Define Measured Densities for planetary bodies
// Uncompressed densities for Mercury, Venus, Earth, Moon, Mars
let measured = [5300, 4400, 4400, 3300, 3800];

// Define default Calculated Densities for planetary bodies
// Overwrite when body is selected and metal percent adjusted
let calculated = [5500, 5500, 5500, 5500, 5500];

function preload() {
  // Load Earth images (globe + core)
  bodies[2] = loadImage("images/earth-globe.png");
  cores[2] = loadImage("images/earth-core.png");
}

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(800, 700);
  canvas0.parent("p5canvas");

  // Set images to position at their centers instead of corners
  imageMode(CENTER);

  // Load images that won't be displayed until user clicks.
  // Two images per body - "globe" = surface, "core" = core.
  // "core" image is scaled to 100% of radius of body
  bodies[0] = loadImage("images/mercury-globe.png");
  bodies[1] = loadImage("images/venus-globe.png");
  bodies[2] = loadImage("images/earth-globe.png");
  bodies[3] = loadImage("images/moon-globe.png");
  bodies[4] = loadImage("images/mars-globe.png");

  cores[0] = loadImage("images/mercury-core.png");
  cores[1] = loadImage("images/venus-core.png");
  cores[2] = loadImage("images/earth-core.png");
  cores[3] = loadImage("images/moon-core.png");
  cores[4] = loadImage("images/mars-core.png");

  // Set black background
  background(237, 199, 183);

  // Set up text labels
  textSize(24);
  textAlign(CENTER);
  text('Rock', 92, 85);
  text('Metal', 92, 510);
  text('Calculated Density', 300, 670);
  text('Measured Density', 660, 670);

  // Set up density slider
  denslide = createSlider(1, 99, 50, 1);
  denslide.style('transform: rotate(90deg)');
  denslide.position(-57, 300);
  denslide.parent("p5canvas");
  denslide.style('width', '300px');
}

function draw() {
  // Get value from density slider
  metpc = denslide.value();

  // Draw a black background behind images
  fill(0);
  rect(185, 0, 600, 600);

  // Write rock and metal percentages above and below slider
  fill('#edc7b7');
  noStroke();
  rect(60, 90, 60, 30);
  rect(60, 455, 60, 30);
  fill(0);
  text(100-metpc + '%', 92, 115);
  text(metpc + '%', 92, 480);

  // Draw planetary body image first, behind core
  image(bodies[bodyNum], 485, 300, 600, 600);

  // Draw planetary core on top, scaled appropriately.
  // Small shift in x-position corrects scaling slightly.
  // Reduce size of core at maximum size by small amount so "crust"
  // is visible around the edges of the core.
  radius = (metpc / 100)**0.333 * 598;
  image(cores[bodyNum], 484 + (100 - metpc) / 30, 300, radius, radius);
}

// Switch the displayed body when one of the buttons is pressed and
// change the highlighting of the new and the old chosen body.
function switchBody(choice) {
  if (choice != currentBody) {
    document.getElementById(currentBody).classList.remove("chosen");
    document.getElementById(choice).classList.add("chosen");
    currentBody = choice;
    bodyNum = names.indexOf(choice);
  }
}

// Define listeners for planetary body button presses
document.getElementById("merc").addEventListener("click", function() {
  switchBody("merc")
});
document.getElementById("venu").addEventListener("click", function() {
  switchBody("venu")
});
document.getElementById("eart").addEventListener("click", function() {
  switchBody("eart")
});
document.getElementById("moon").addEventListener("click", function() {
  switchBody("moon")
});
document.getElementById("mars").addEventListener("click", function() {
  switchBody("mars")
});
