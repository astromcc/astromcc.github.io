// Display a range of stellar spectra from the Pickles catalog (1998).
// Further ideas for the page or another similar page:
// * Add an intensity readout to display the mouseY position scaled from
//   zero (on the x axis) to one (at the top of the spectrum).
// * Add a semi-transparent background of the visible spectrum to give
//   visual context to the wavelengths.
// * Add the option to display markers for the strongest spectral lines of
//   different chemical elements (H, He, Ca, Na, Fe, etc.)
// * Add the UBVR filter functionality to display color indices and illustrate
//   how color filters sample the incoming spectrum.

// Define the offset between wavelength in nanometers and
// x position on the canvas on the page.
let xoffset = -150;

// Define placement of x and y axes on the canvas
let xorigin = 300;
let yorigin = 460;
let ybandheight = 20;
let xend = 900;
let yend = 50;

// Currently chosen spectrum to display
let currentSpec = "g2v";

// Define spectral maxima to scale display of spectra
// Values read in from Python
let specmaxes = {
  "o9v": 8.31,
  "b3v": 3.96,
  "b8v": 2.76,
  "a0v": 2.41,
  "a3v": 2.24,
  "a7v": 1.89,
  "f2v": 1.36,
  "f8v": 1.21,
  "g2v": 1.17,
  "g8v": 1.09,
  "k2v": 1.07,
  "k7v": 1.39,
  "m2v": 2.19,
  "m6v": 22.08,
};

function preload() {
  // Load default G2V stellar spectrum
  g2vflux = loadJSON("data/g2vflux300900.json");
}

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(867, 600);
  canvas0.parent("p5canvas");
  // Load remaining stellar spectra that won't be displayed until user clicks.
  // These data are lists in 1 nanometer intervals from 300 to 900 nanometers
  // Stellar spectra are fluxes, normalized to 1 at 500 nanometers
  o9vflux = loadJSON("data/o9vflux300900.json");
  b3vflux = loadJSON("data/b3vflux300900.json");
  b8vflux = loadJSON("data/b8vflux300900.json");
  a0vflux = loadJSON("data/a0vflux300900.json");
  a3vflux = loadJSON("data/a3vflux300900.json");
  a7vflux = loadJSON("data/a7vflux300900.json");
  f2vflux = loadJSON("data/f2vflux300900.json");
  f8vflux = loadJSON("data/f8vflux300900.json");
  g8vflux = loadJSON("data/g8vflux300900.json");
  k2vflux = loadJSON("data/k2vflux300900.json");
  k7vflux = loadJSON("data/k7vflux300900.json");
  m2vflux = loadJSON("data/m2vflux300900.json");
  m6vflux = loadJSON("data/m6vflux300900.json");
  // Load UBVR bandpasses that won't be displayed until user clicks.
  // Bandpasses are transmission coefficients, normalized to 1
  uband = loadJSON("data/ubandpass300900.json");
  bband = loadJSON("data/bbandpass300900.json");
  vband = loadJSON("data/vbandpass300900.json");
  rband = loadJSON("data/rbandpass300900.json");
  // Set black background, draw axes, and display default G2V spectrum
  background(0);
  drawAxes();
  drawEMBand();
  drawSpectrum(g2vflux);
}

function draw() {
  if (mouseIsPressed) {
    leftX = xorigin + xoffset;
    rightX = xend + xoffset;
    if (mouseX > leftX && mouseX < rightX && mouseY > yend && mouseY < yorigin) {
      mouseReadout(Math.round(mouseX - xoffset));
    }
  }
}

// Draw axes lines, tick marks, axis labels, and wavelength readout
function drawAxes() {
  // Draw x-axis
  push();
  strokeWeight(1.5);
  stroke(255, 255, 255);
  translate(xoffset, 0);
  // Draw x-axis
  line(xorigin - 10, yorigin, xend, yorigin);
  // Draw line parallel to y-axis as top of electromagnetic band
  line(xorigin, yorigin - ybandheight, xend, yorigin - ybandheight);
  // Add x-axis tick marks every 100 nanometers between 300 and 900 nm
  for (let w = xorigin; w < xend + 1; w += 100) {
    line(w, yorigin, w, yorigin + 10);
  }
  // Draw y-axis
  line(xorigin, yorigin + 10, xorigin, yend);
  // Add one y-axis tick at the top of the axis
  line(xorigin, yend, xorigin - 10, yend);
  pop();

  // Add labels to x-axis and y-axis
  push();
  translate(xoffset, 0);
  textSize(24);
  fill(255);
  noStroke();
  // Label the x axis
  text('wavelength (nm)', 520, yorigin + 60);
  // Label the y axis
  text('intensity', xorigin - 110, yend + 5);
  pop();
  // Label the x axis tick marks with wavelength values
  push();
  translate(xoffset, 0);
  textSize(18);
  fill(255);
  noStroke();
  for (let w = xorigin; w < xend + 1; w += 100) {
    text(str(w), w - 15, yorigin + 30)
  }
  // No label on y axis?
  // Wavelength readout label
  text("wavelength under cursor:", 495, yorigin + 100);
  pop();
}

// Draw the electromagnetic spectrum labels and visible colors
// UV: 300-380nm, VIS:380-750nm, IR: 750-900nm
function drawEMBand() {
  push();
  translate(xoffset, 0);
  textSize(16);
  fill(255);
  noStroke();
  // Add labels for UV, VIS, IR
  emlabelheight = yorigin - 5;
  uvxpos = 305;
  visxpos = 555;
  irxpos = 805;
  text('ultraviolet', uvxpos, emlabelheight);
  text('visible light', visxpos, emlabelheight);
  text('infrared', irxpos, emlabelheight);
  pop();
}

// Draw the chosen stellar spectrum into the graph.
function drawSpectrum(spectrum) {
  push();
  translate(xoffset, 0);
  beginShape();
  noFill();
  strokeWeight(1);
  stroke(155, 255, 155);
  specmax = specmaxes[currentSpec];
  ytop = yend + 5;
  ybottom = yorigin - ybandheight - 2;
  for (let w = 300; w <= 900; w++) {
    ypos = map(spectrum[w - 300], 0, specmax, ybottom, ytop);
    vertex(w, ypos);
  }
  endShape();
  pop();
}

// Switch the displayed spectrum when one of the buttons is pressed and
// change the highlighting of the new and the old chosen spectral type.
function switchSpec(choice, spectrum) {
  if (choice != currentSpec) {
    document.getElementById(currentSpec).classList.remove("chosen");
    document.getElementById(choice).classList.add("chosen");
    currentSpec = choice;
    background(0);
    drawAxes();
    drawEMBand();
    drawSpectrum(spectrum);
  }
}

function mouseReadout(pos) {
  fill(0);
  rect(550, yorigin + 72, 80, 40);
  push();
  textSize(18);
  noStroke();
  fill(255);
  text(pos + "nm", 555, yorigin + 100);
  pop();
}

// Define listeners for spectral-type button presses
// This syntax is necessary because the buttons are defined in HTML.
document.getElementById("o9v").addEventListener("click", function() {
  switchSpec("o9v", o9vflux)
});
document.getElementById("b3v").addEventListener("click", function() {
  switchSpec("b3v", b3vflux)
});
document.getElementById("b8v").addEventListener("click", function() {
  switchSpec("b8v", b8vflux)
});
document.getElementById("a0v").addEventListener("click", function() {
  switchSpec("a0v", a0vflux)
});
document.getElementById("a3v").addEventListener("click", function() {
  switchSpec("a3v", a3vflux)
});
document.getElementById("a7v").addEventListener("click", function() {
  switchSpec("a7v", a7vflux)
});
document.getElementById("f2v").addEventListener("click", function() {
  switchSpec("f2v", f2vflux)
});
document.getElementById("f8v").addEventListener("click", function() {
  switchSpec("f8v", f8vflux)
});
document.getElementById("g2v").addEventListener("click", function() {
  switchSpec("g2v", g2vflux)
});
document.getElementById("g8v").addEventListener("click", function() {
  switchSpec("g8v", g8vflux)
});
document.getElementById("k2v").addEventListener("click", function() {
  switchSpec("k2v", k2vflux)
});
document.getElementById("k7v").addEventListener("click", function() {
  switchSpec("k7v", k7vflux)
});
document.getElementById("m2v").addEventListener("click", function() {
  switchSpec("m2v", m2vflux)
});
document.getElementById("m6v").addEventListener("click", function() {
  switchSpec("m6v", m6vflux)
});
