// Map SDSS galaxies in a portion of the sky (RA = 10-16h, Dec = 10-55 deg).
// A range of redshift may be selected to narrow the display of galaxies.
// Further ideas for the page:
// * Plot in RA-z plane or Dec-z plane. Would require polar diagram!

// NEW IDEA: Add function to plot galaxies on plane of sky OR
// polar plot of RA vs redshift: RA as theta, redshift as radius

// Entire extent of galaxy sample in JSON file, defined in Python notebook
// RA and Dec limits are arbitrary but chosen to be square, 45deg x 45deg
// Also chosen to include Virgo and Coma clusters at low redshift
const ramin = 165; // Minimum RA of galaxy map, 10h = 150d
const ramax = 210; // Maximum RA of galaxy map, 13h = 195d
const decmin = 10; // Minimum Dec of galaxy map, in degrees
const decmax = 55; // Maximum Dec of galaxy map, in degrees

const zmin = 0.0;  // Minimum redshift of galaxy sample
const zmax = 0.5;  // Maximum redshift of galaxy sample
const dzed = 0.01; // Width of redshift range for plotting

// Slider transformation, z(s) = m*s + b, where slider value = s
const sliderMin = 0;
const sliderMax = 100;
const zSliderSlope = (1/100)*(zmax - zmin - 2*dzed);
const zSliderConst = zmin + dzed;

// Rectangular sky box to fill with galaxies
// OLD const plotxy = 600;
const xwidth = 750;
const yheight = 750;
// x position of RA limits, remembering RA increases to the left in the sky
// So xleft is left of xright on canvas, higher RA to the left on canvas
const xleft = 210;
const xright = xleft + xwidth;
// y positions of Dec limits, remembering y increases downward on the canvas
// ytop is above ybot on canvas, increasing Dec higher on canvas
const ytop = 30;
const ybot = ytop + yheight;

// x positions for "0.0" and "0.5" labels of redshift slider
const x00 = 150;

// y position for "Redshift" and z-value labels of redshift slider
const xlabel = 105;
const ylabel = 120;
const labelSep = 20;

// Calculate celestial RA/Dec -> canvas x/y transform
// Both slopes are negative because of the coordinate setup
// RA on sky increases to the left, x on canvas increases to the right
// Dec on sky increases toward top, y on campus increases toward bottom
const mx = (xwidth) / (ramin - ramax);
const my = (yheight) / (decmin - decmax);
const x0 = xright - mx*ramin;
const y0 = ybot - my*decmin;

let zSlider;
let zPlay;
let galaxyData;
let xlist = [];
let ylist = [];
let ngals;
let firstDraw = true;

function preload() {
  // Load galaxy data (RA, Dec, z)
  radata  = loadJSON("data/sdss-gals/sdss-gals-ra.json");
  decdata = loadJSON("data/sdss-gals/sdss-gals-dec.json");
  zdata   = loadJSON("data/sdss-gals/sdss-gals-z.json");
}

function setup() {
  const canvas = createCanvas(986, 900);
  canvas.parent("p5canvas");
  background(238, 226, 220);

  noLoop();

  placeSlider();
  // placeAllZButton();
  // placePlayButton();

  drawSliderLabels();
  drawGalaxiesInRD(0.0, 0.5);

  galaxyData = mergeGalaxyData(radata, decdata, zdata);
  ngals = galaxyData.length;
}

function mouseReleased() {
  redraw();
}

function draw() {
  //if (firstDraw) {
  //  zlo = 0.0; zhi = 0.5;
  //} else {
  //  [zlo, zhi] = readSliderZ();
  //}
  //
  //firstDraw = false;
  [zlo, zhi] = readSliderZ();

  // Draw a black background for the sky box
  fill(0);
  rect(xleft-1, ytop-1, xwidth+2, yheight+2);

  drawGalaxiesInRD(zlo, zhi);
  updateZDisplay(zlo, zhi);
}

function placeSlider() {
  zSlider = createSlider(sliderMin, sliderMax, 50);
  zSlider.position(-44, 300);
  zSlider.style('transform: rotate(-90deg)');
  zSlider.parent('p5canvas');
}

function placePlayButton() {
  zPlay = createButton("PLAY");
  zPlay.style("font-size", "18px");
  zPlay.style("border", "2px solid #000000");
  zPlay.style("border-radius", "4px");
  zPlay.position(xlabel-30, 780);
  zPlay.size(100, 30);
}

function placeAllZButton() {
  allZ = createButton("Show all");
  allZ.style("font-size", "18px");
  allZ.style("border", "2px solid #000000");
  allZ.style("border-radius", "4px");
  allZ.position(xlabel-30, 735);
  allZ.size(100, 30);
  //allZ.mousePressed(drawGalaxiesInRD(0.0,0.5));
}

function drawSliderLabels() {
  textSize(20);
  textAlign(CENTER);
  //text('0.00', x00,   535);
  //text('0.50', x00+1, 195);
  text('Redshift', xlabel, ylabel-labelSep);
}

function readSliderZ() {
  zvalue = zSlider.value();
  zed = zSliderSlope*zvalue + zSliderConst;
  low = zed - dzed;
  high = zed + dzed;
  return [low, high];
}

function updateZDisplay(lowZ, hiZ) {
  //fill(255, 128, 128);
  fill(238, 226, 220);
  noStroke();
  rect(xlabel - 73, ylabel + labelSep - 22, 146, 30);
  fill(0);
  text(lowZ.toFixed(3), xlabel - 45, ylabel + labelSep);
  text("to", xlabel, ylabel + labelSep);
  text(hiZ.toFixed(3), xlabel + 45, ylabel + labelSep);
}

// Draw a dot if the galaxy is in the correct range of RA, Dec, z
function drawGalaxiesInRD(lowZ, hiZ) {
  stroke(255);
  strokeWeight(1.5);
  for (id = 0; id < ngals; id++) {
    if (galaxyData[id].z >= lowZ && galaxyData[id].z <= hiZ
        && galaxyData[id].rdx >= xleft && galaxyData[id].rdx <= xright
        && galaxyData[id].rdy <= ybot  && galaxyData[id].rdy >= ytop) {
      point(galaxyData[id].rdx, galaxyData[id].rdy);
    }
  }
}

// How to implement a "bounce" function that steps a value
// back and forth between two limits?
function playSliderZ() {

}

// Transform RA/Dec pairs to xy pairs based on canvas layout defined above
function celestialToCanvas(ra, dec) {
  let xpos = mx*ra  + x0;
  let ypos = my*dec + y0;

  return [round(xpos), round(ypos)];
}

// Merge the RA, Dec, z objects read from JSON files
function mergeGalaxyData(ra, dec, z) {
  var data = [];
  for (id in ra) {
    // rdx,rdy are projected x,y coordinates in the RA,Dec plane (sky plane)
    // rzx,rzy are projected x,y coordinates in the RA,z plane (constant Dec)
    // dzx,dzy are projected x,y coordinates in the Dec,z plane (constant RA)
    [rdx, rdy] = celestialToCanvas(ra[id], dec[id]);
    data.push({ra: ra[id], dec: dec[id], z: z[id], rdx: rdx, rdy: rdy});
  }
  return data;
}