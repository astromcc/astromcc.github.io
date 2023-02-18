// Mandelbrot set viewer
// Based on Coding Challenge #21 from Dan Shiffman's Coding Train channel
// on YouTube, published June 13, 2016

// NOT IMPLEMENTED -- idea for controls
//
//   large change in position is 1/3 of window
//   small change in position is 1/10 of window
//   large change in zoom is factor of 2
//   small change in zoom is factor of 1.1
// This means that change in position depends on zoom factor

function setup() {
  let canvas0 = createCanvas(800,800);
  canvas0.parent("p5canvas");
  pixelDensity(1);

  xcenter = -0.5;
  ycenter = 0;
  zoom = 2;
  maxiterations = 100;
}

function draw() {

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {

      // c = a + bi
      // Define range of a, b >> -2, 2
      let a = map(x, 0,  width, xcenter-zoom, xcenter+zoom);
      let b = map(y, 0, height, ycenter-zoom, ycenter+zoom);

      let ca = a;
      let cb = b;

      let n = 0;

      while (n < maxiterations) {
        // Calculate components of z squared
        let aa = a*a - b*b;
        let bb = 2*a*b;

        // Add z squared to c
        a = aa + ca;
        b = bb + cb;

        // Did number get too big to carry on?
        if (abs(a) + abs(b) > 16) {
          break;
        }
        n++;
      }

      let bright = map(n, 0, maxiterations, 0, 1);
      bright = map(sqrt(bright), 0, 1, 0, 255)

      if (n == maxiterations) {
        bright = 0;
      }

      let pix = (x + y*width) * 4;
      pixels[pix + 0] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

// Shift drawing in the x-direction
// Remember: +ve x is RIGHT on Canvas!
function xmm() {
  xcenter = xcenter - 2*zoom/3;
  console.log(xcenter);
}

function xminus() {
  xcenter = xcenter - zoom/10;
  console.log(xcenter);
}

function xplus() {
  xcenter = xcenter + zoom/10;
  console.log(xcenter);
}

function xpp() {
  xcenter = xcenter + 2*zoom/3;
  console.log(xcenter);
}

// Shift drawing in the y-direction
// Remember: +ve y is DOWN on Canvas!
function ymm() {
  ycenter = ycenter + 2*zoom/3;
  console.log(ycenter);
}

function yminus() {
  ycenter = ycenter + zoom/10;
  console.log(ycenter);
}

function yplus() {
  ycenter = ycenter - zoom/10;
  console.log(ycenter);
}

function ypp() {
  ycenter = ycenter - 2*zoom/3;
  console.log(ycenter);
}

// Change zoom level for drawing
function zmm() {
  zoom = zoom * 2;
  console.log(zoom);
}

function zminus() {
  zoom = zoom * 1.1;
  console.log(zoom);
}

function zplus() {
  zoom = zoom / 1.1;
  console.log(zoom);
}

function zpp() {
  zoom = zoom / 2;
  console.log(zoom);
}

// Change detail level of drawing
function rminus() {
  if (maxiterations > 11) {
    maxiterations = maxiterations - 10;
  }
  console.log(maxiterations);
}

function rplus() {
  maxiterations = maxiterations + 10;
  console.log(maxiterations);
}
