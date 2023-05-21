// Map SDSS galaxies in a portion of the sky (RA = 10-16h, Dec = 10-55 deg).
// A range of redshift may be selected to narrow the display of galaxies.
// Further ideas for the page:
// * Plot in RA-z plane or Dec-z plane. Would require polar diagram!

// NEW IDEA: Add function to plot galaxies on plane of sky OR
// polar plot of RA vs redshift: RA as theta, redshift as radius

// Entire extent of galaxy sample in JSON file, defined in Python notebook
// RA and Dec limits are arbitrary but chosen to be square, 45deg x 45deg
// Also chosen to include Virgo and Coma clusters at low redshift
const RAMIN = 165; // Minimum RA of galaxy map, 11h = 165d
const RAMAX = 210; // Maximum RA of galaxy map, 14h = 210d
const DECMIN = 10; // Minimum Dec of galaxy map, in degrees
const DECMAX = 55; // Maximum Dec of galaxy map, in degrees

const ZMIN = 0.0;  // Minimum redshift of galaxy sample
const ZMAX = 0.5;  // Maximum redshift of galaxy sample
const DZED = 0.01; // Width of redshift range for plotting

// Slider transformation, z(s) = m*s + b, where slider value = s
const sliderMin = 0;
const sliderMax = 100;
const zSliderSlope = (1/100)*(ZMAX - ZMIN - 2*DZED);
const zSliderConst = ZMIN + DZED;

// Rectangular sky box to fill with galaxies
// OLD const plotxy = 600;
const XWIDTH = 750;
const YHEIGHT = 750;
// x position of RA limits, remembering RA increases to the left in the sky
// So xleft is left of xright on canvas, higher RA to the left on canvas
const XLEFT = 210;
const XRIGHT = XLEFT + XWIDTH;
// y positions of Dec limits, remembering y increases downward on the canvas
// ytop is above ybot on canvas, increasing Dec higher on canvas
const YTOP = 30;
const YBOT = YTOP + YHEIGHT;

// x positions for "0.0" and "0.5" labels of redshift slider
const X00 = 150;

// y position for "Redshift" and z-value labels of redshift slider
const XLABEL = 105;
const YLABEL = 120;
const labelSep = 20;

// Calculate celestial RA/Dec -> canvas x/y transform
// Both slopes are negative because of the coordinate setup
// RA on sky increases to the left, x on canvas increases to the right
// Dec on sky increases toward top, y on campus increases toward bottom
const MX = XWIDTH / (RAMIN - RAMAX);
const MY = YHEIGHT / (DECMIN - DECMAX);
const X0 = XRIGHT - MX*RAMIN;
const Y0 = YBOT - MY*DECMIN;

let zSlider;
let zPlay;
let galaxyData;
let xlist = [];
let ylist = [];
let nGals;
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
  placeAllZButton();
  placePlayButton();

  drawSliderLabels();
  drawGalaxiesInRD(0.0, 0.5);
  drawHorizontalAxis(XLEFT, XRIGHT, YBOT, 5, 10, 16, true, 2, 7, "Right Ascension (hours)");

  galaxyData = mergeGalaxyData(radata, decdata, zdata);
  nGals = galaxyData.length;
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
  rect(XLEFT-1, YTOP-1, XWIDTH+2, YHEIGHT+2);

  drawGalaxiesInRD(zlo, zhi);
  updateZDisplay(zlo, zhi);
}

function placeSlider() {
  zSlider = createSlider(sliderMin, sliderMax, 50);
  zSlider.position(-44, 300);
  zSlider.style('transform: rotate(-90deg)');
  zSlider.parent('p5canvas');
}

function placeAllZButton() {
  allZ = createButton("Show all");
  allZ.style("font-size", "18px");
  allZ.style("border", "2px solid #000000");
  allZ.style("border-radius", "4px");
  allZ.position(XLABEL + 72, 735);
  allZ.size(100, 30);
  allZ.mousePressed(drawGalaxiesInRD);
}

function placePlayButton() {
  zPlay = createButton("PLAY");
  zPlay.style("font-size", "18px");
  zPlay.style("border", "2px solid #000000");
  zPlay.style("border-radius", "4px");
  zPlay.position(XLABEL + 72, 780);
  zPlay.size(100, 30);
}

function drawSliderLabels() {
  textSize(20);
  fill(0);
  strokeWeight(0);
  textAlign(CENTER);
  //text('0.00', x00,   535);
  //text('0.50', x00+1, 195);
  text('Redshift', XLABEL, YLABEL-labelSep);
}

function readSliderZ() {
  zvalue = zSlider.value();
  zed = zSliderSlope*zvalue + zSliderConst;
  low = zed - DZED;
  high = zed + DZED;
  return [low, high];
}

function updateZDisplay(lowZ, hiZ) {
  //fill(255, 128, 128);
  fill(238, 226, 220);
  noStroke();
  rect(XLABEL - 73, YLABEL + labelSep - 22, 146, 30);
  fill(0);
  textSize(20);
  text(lowZ.toFixed(3), XLABEL - 35, YLABEL + labelSep);
  text("-", XLABEL, YLABEL + labelSep);
  text(hiZ.toFixed(3), XLABEL + 35, YLABEL + labelSep);
}

// Draw a dot if the galaxy is in the correct range of RA, Dec, z
function drawGalaxiesInRD(lowZ, hiZ) {
  stroke(255);
  strokeWeight(1.5);
  for (id = 0; id < nGals; id++) {
    if (galaxyData[id].z >= lowZ && galaxyData[id].z <= hiZ
        && galaxyData[id].rdx >= XLEFT && galaxyData[id].rdx <= XRIGHT
        && galaxyData[id].rdy <= YBOT  && galaxyData[id].rdy >= YTOP) {
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
  let xpos = MX*ra  + X0;
  let ypos = MY*dec + Y0;

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

function drawHorizontalAxis(startX, endX, axisY, nTicks,
                            startLabel, fontSize, reverse,
                            tickThickness, tickLength,
                            axisLabel) {
  let step = (endX - startX) / (nTicks - 1);
  let labels = Array.from({length: nTicks}, (e,i) => (i + startLabel));

  for (i = 0; i < nTicks; i++) {
    tickX = startX + i*step;
    stroke(0);
    strokeWeight(tickThickness);
    line(tickX, axisY, tickX, axisY + tickLength);
    strokeWeight(0);
    textAlign(CENTER);
    textSize(16);
    if (reverse) {
      label = labels[labels.length - i - 1];
      labelString = label.toString();
    } else {
      label = labels[i];
      labelString = label.toString();
    }
    text(labelString, tickX, axisY + fontSize + 10);
  }

  let labelX = (startX + endX) / 2;
  textSize(18);
  text(axisLabel, labelX, axisY + fontSize*4);
}