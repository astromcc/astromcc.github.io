// Graph 4 different models of cosmic expansion.

// Variables for interface
// slider element
let slider;

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(800, 700);
  canvas0.parent("p5canvas");

  // Set background
  background(237, 199, 183);

  // Set up density slider
  // rock at top to mimic surface, metal at bottom to mimic core
  // rotate slider from left>right into bottom>top orientation
  // This rotation allows up/down arrow keys to adjust slider naturally
  // Slider VALUE is equal to ROCK percentage, 1-99
  slider = createSlider(1, 99, 50, 1);
  slider.style('transform: rotate(-90deg)');
  slider.position(-57, 300);
  slider.parent("p5canvas");
  slider.style('width', '300px');
}

function draw() {
  // Draw a black background behind images
  fill(0);
  rect(185, 0, 600, 600);
}
