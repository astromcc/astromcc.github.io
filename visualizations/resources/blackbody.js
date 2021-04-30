// A script to draw the blackbody spectrum per unit wavelength
// for a temperature selected by the user.

// B_lambda(lambda, T) = ( 2hc^2 / lambda^5 ) / ( exp(hc/lambda k_B T) - 1)
// B_lambda(lambda, T) = ( leadTerm / lambda^5 ) /
//                       ( exp(expTerm/lambda*T) - 1 )

// Define variables
let leadTerm = 1.19412e-16; // 2hc^2
let expTerm = 0.014413; // hc/k_B

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(1000, 600);
  canvas0.parent("p5canvas");

  // Define color for background
  let bgColor = color(0);
  background(bgColor);
  drawAxes();
  console.log(planck(500e-9, 5777));
}

//function draw() {
//  background(bgColor);
//}

function planck(lam, T) {
  let first = (leadTerm / pow(lam, 5));
  let second = (exp(expTerm / (lam * T)) - 1);
  return first / second;
}

function drawAxes() {
  // Define placement of x and y axes on the canvas
  let xorigin = 100;
  let yorigin = 500;
  let xend = 800;
  let yend = 100;
  // Define axes lines
  strokeWeight(2);
  stroke(255, 255, 255);
  // Draw x axis
  line(xorigin - 10, yorigin, xend, yorigin);
  // Add x-axis tick marks every 100 nanometers between 300 and 800 nm
  for (let w = xorigin; w < xend + 1; w += 100) {
    line(w, yorigin, w, yorigin + 10);
  }
  // Draw y axis
  line(xorigin, yorigin + 10, xorigin, yend);
  // Add one y-axis tick at the top of the axis
  line(xorigin, yend, xorigin - 10, yend);
  // Add labels to x-axis
  textSize(24);
  fill(255);
  noStroke();
  text('wavelength (nm)', 410, yorigin + 60);
  text('intensity', xorigin - 50, yend - 10);
  textSize(18);
  for (w = xorigin; w < xend + 1; w += 100) {
    text(str(w), w - 15, yorigin + 30)
  }
}

// Function retrieved from:
// https://stackoverflow.com/questions/3407942/rgb-values-of-visible-spectrum
function visibleSpectrum(w) {
  let r = 0;
  let g = 0;
  let b = 0;
  if ((w >= 400.0) && (w < 410.0)) {
    t = (w - 400.0) / (410.0 - 400.0);
    r = +(0.33 * t) - (0.20 * t * t);
  } else if ((w >= 410.0) && (w < 475.0)) {
    t = (w - 410.0) / (475.0 - 410.0);
    r = 0.14 - (0.13 * t * t);
  } else if ((w >= 545.0) && (w < 595.0)) {
    t = (w - 545.0) / (595.0 - 545.0);
    r = +(1.98 * t) - (t * t);
  } else if ((w >= 595.0) && (w < 650.0)) {
    t = (w - 595.0) / (650.0 - 595.0);
    r = 0.98 + (0.06 * t) - (0.40 * t * t);
  } else if ((w >= 650.0) && (w < 700.0)) {
    t = (w - 650.0) / (700.0 - 650.0);
    r = 0.65 - (0.84 * t) + (0.20 * t * t);
  }
  if ((w >= 415.0) && (w < 475.0)) {
    t = (w - 415.0) / (475.0 - 415.0);
    g = +(0.80 * t * t);
  } else if ((w >= 475.0) && (w < 590.0)) {
    t = (w - 475.0) / (590.0 - 475.0);
    g = 0.8 + (0.76 * t) - (0.80 * t * t);
  } else if ((w >= 585.0) && (w < 639.0)) {
    t = (w - 585.0) / (639.0 - 585.0);
    g = 0.84 - (0.84 * t);
  }
  if ((w >= 400.0) && (w < 475.0)) {
    t = (w - 400.0) / (475.0 - 400.0);
    b = +(2.20 * t) - (1.50 * t * t);
  } else if ((w >= 475.0) && (w < 560.0)) {
    t = (w - 475.0) / (560.0 - 475.0);
    b = 0.7 - (t) + (0.30 * t * t);
  }
  r8 = int(r * 255);
  g8 = int(g * 255);
  b8 = int(b * 255);
  return color(r8, g8, b8);
}