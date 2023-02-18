// Map SDSS galaxies in a portion of the sky (RA = 10-16h, Dec = 10-55 deg).
// A range of redshift may be selected to narrow the display of galaxies.
// Further ideas for the page:
// * Plot in RA-z plane or Dec-z plane. Would require polar diagram!

// Entire extent of galaxy sample in JSON file, defined in Python notebook
const ramin = 150; // Minimum RA of galaxy map, 10h = 150d
const ramax = 240; // Maximum RA of galaxy map, 16h = 240d
const decmin = 10;  // Minimum Dec of galaxy map, in degrees
const decmax = 55;  // Maximum Dec of galaxy map, in degrees
// Seems to be a sampling issue (high galaxy counts) for z > 0.75
// in the neighborhood of RA, Dec ~ 10h, 20d
const zmin = 0;    // Minimum redshift of galaxy sample
const zmax = 0.5;    // Maximum redshift of galaxy sample

// Square region (height = width) of p5js Canvas to fill with galaxies
const plotxy = 630;
// x position of RA limits, remembering RA increases to the left in the sky
// So xleft is left of xright on canvas, higher RA to the left on canvas
const xleft = 350;
const xright = xleft + plotxy;
// y positions of Dec limits, remembering y increases downward on the canvas
// ytop is above ybot on canvas, increasing Dec higher on canvas
const ytop = 20;
const ybot = ytop + plotxy;

// Calculate celestial RA/Dec -> canvas x/y transform
const mx = (xleft - xright) / (ramax - ramin);
const my = (ytop - ybot)   / (decmax - decmin);
// console.log(mx, my);
const x0 = xleft - mx*ramax;
const y0 = ybot - my*decmin;
// console.log(x0, y0);

// Define user controls
let zhi_slider;

function preload() {
  // Load galaxy data (RA, Dec, z)
  // The JSON file written in Python cannot be read by p5.js loadJSON,
  // so we're relying on the fetch API to load the file. Not sure if the
  // separate async function AND the preload() function are redundant.
  radata  = loadJSON("data/sdss-gals/sdss-gals-ra.json");
  decdata = loadJSON("data/sdss-gals/sdss-gals-dec.json");
  zdata   = loadJSON("data/sdss-gals/sdss-gals-z.json");
}

function setup() {
  // Create canvas and assign to html div
  let canvas0 = createCanvas(986, 700);
  canvas0.parent("p5canvas");

  // Create frame around sky-box
  background(238, 226, 220);
  // stroke(0, 255);
  // strokeWeight(1);
  // rect(xleft, ytop, plotxy);

  ralist = flattenObj(radata);
  declist = flattenObj(decdata);
  zlist = flattenObj(zdata);
  ngals = ralist.length;

  // Convert RA/Dec into xy pairs, one time since ralist and declist are static
  xlist = [];
  ylist = [];
  for (let id = 0; id < ngals; id++) {
    [galx, galy] = celestialToCanvas(ralist[id], declist[id])
    xlist.push(galx);
    ylist.push(galy);
  }

  // Create user controls
  zhi_slider = createSlider(0, 50, 50);
  zhi_slider.position(300, 600);
  zhi_slider.style('transform: rotate(-90deg)');
  zhi_slider.position(12, 337);
  zhi_slider.parent('p5canvas');
  // console.log(zhi_slider);
  noLoop();

  // Create text labels
  textSize(20);
  textAlign(CENTER);
  text('0.0', 161, 540);
  text('0.5', 162, 190);
  text('Redshift', 90, 362);
}

function mouseReleased() {
  redraw();
}

function draw() {
  zslide = zhi_slider.value();
  zed = zslide / 100.0;
  //console.log(zhi);

  // Draw a black background
  fill(0);
  rect(xleft, ytop, plotxy);

  // Draw a point for each galaxy
  // stroke() is the only parameter of a p5js point object
  stroke(255, 127);

  // Plot a point on the sky-box if zlo < z < zhi
  dzed = 0.01;
  zlo = zed - dzed;
  zhi = zed + dzed;
  for (let id = 0; id < ngals; id++) {
    if (zlist[id] >= zlo && zlist[id] <= zhi) {
      point(xlist[id], ylist[id]);
    }
  }

  // Display the current redshift value from slider
  fill(238, 226, 220);
  noStroke();
  rect(195, 340, 50, 30);
  fill(0);
  text(zed.toFixed(2), 220, 362);
}

// Transform RA/Dec pairs to xy pairs based on canvas layout defined above
function celestialToCanvas(ra, dec) {
  let xpos = 0;
  let ypos = 0;

  xpos = mx*ra + x0;
  ypos = my*dec + y0;

  return [xpos, ypos]
}

// Strip the Object wrapper from the data array imported as JSON.
function flattenObj(obj) {
  const result = [];
  for (key in obj) {
    const el = obj[key];
    result.push(el);
  };
  return result;
}