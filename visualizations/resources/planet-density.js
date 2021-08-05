// Display the "core" and "globe" images for Earth by default.
// Load other images for use when user selects a different body.

// Define the offset between wavelength in nanometers and
// x position on the canvas on the page.
let xoffset = -150;

// Define placement of x and y axes on the canvas
let xorigin = 300;
let yorigin = 470;
let xend = 900;
let yend = 70;

let button;

// Currently chosen body to display
let currentBody = "earth";

// Define spectral maxima to scale display of spectra
// Values read in from Python
let measured = {
  "mercury": 5400,
  "venus": 5200,
  "earth": 5500,
  "moon": 3300,
  "mars": 3900
};

function preload() {
  // Load default G2V stellar spectrum
  earsurf = loadImage("images/earth-globe.png");
  earcore = loadImage("images/earth-core.png");
}

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(600, 600);
  canvas0.parent("p5canvas");
  // Load remaining images that won't be displayed until user clicks.
  // Two images per body - "globe" displays surface, "core" is core.
  // "core" image is scaled to 100% of radius of body
  mersurf = loadImage("images/mercury-globe.png");
  mercore = loadImage("images/mercury-core.png");
  vensurf = loadImage("images/venus-globe.png");
  vencore = loadImage("images/venus-core.png");
  moosurf = loadImage("images/moon-globe.png");
  moocore = loadImage("images/moon-core.png");
  marsurf = loadImage("images/mars-globe.png");
  marcore = loadImage("images/mars-core.png");

  // Set black background, draw axes, and display default G2V spectrum
  background(0);
}

function draw() {
  image(earsurf, 0, 0, 600, 600);
  image(earcore, 0, 0, 600, 600);
}

// Switch the displayed body when one of the buttons is pressed and
// change the highlighting of the new and the old chosen body.
function switchBody(choice, spectrum) {
  if (choice != currentBody) {
    document.getElementById(currentBody).classList.remove("chosen");
    document.getElementById(choice).classList.add("chosen");
    currentBody = choice;
    background(42);
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
