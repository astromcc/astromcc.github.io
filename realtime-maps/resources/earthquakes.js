/* Notes on Mapbox maps:
   The default projection is known as Web Mercator, which like Mercator maps
   the north and south poles at infinity. The WM projection cuts off the map
   at +/- 85 degrees (see wikipedia article for details). For simplicity, this
   map is not corrected, so earthquakes near the poles will be missing.
   Followup question: how many earthquakes are this close to the poles?
*/

// Mapbox dark Monochrome is
//                      mapbox://styles/astrogeek/ckcibkari2wfm1ipshm72vc4d
// Mapbox light Monochrome is
//                      mapbox://styles/astrogeek/ckcivb3vs3fb81imo752vgmv5

// URL to map in Light Monochrome is
// https://api.mapbox.com/styles/v1/astrogeek/ckcivb3vs3fb81imo752vgmv5/static/0,0,1,0/1024x512?access_token=pk.eyJ1IjoiYXN0cm9nZWVrIiwiYSI6ImNrY2k4aG1tcDBnZ2cyeXJwMHB6cnV0bzMifQ.Rrfp5d6Uw2xUun8r9MBfNQ

let mapimg;

let clat = 0;
let clon = 0;

// Tempe, AZ, USA 33.427204, -111.939896
let lat = 0;
let lon = 0;

let zoom = 1;

let earthquakes;

function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/astrogeek/ckcivb3vs3fb81imo752vgmv5/static/0,0,1,0/1024x512?access_token=pk.eyJ1IjoiYXN0cm9nZWVrIiwiYSI6ImNrY2k4aG1tcDBnZ2cyeXJwMHB6cnV0bzMifQ.Rrfp5d6Uw2xUun8r9MBfNQ');
  eqweek = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.csv');
  eqmonth = loadStrings('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv');
}

function setup() {
  let canvas0 = createCanvas(1024, 512);
  translate(width / 2, height / 2);
  imageMode(CENTER);

  canvas0.parent("p5canvas");

  image(mapimg, 0, 0);

  // Calculate map center position on image
  let cx = mercX(clon);
  let cy = mercY(clat);

  for (let i = 0; i < eqmonth.length; i++) {
    let data = eqmonth[i].split(',');
    let timedate = data[0];
    let lat = float(data[1]);
    let lon = float(data[2]);
    let depth = float(data[3]);
    let mag = float(data[4]);

    // if (mag > 6) {
    //   console.log(timedate, lat, lon, mag, depth);
    // }

    // Calculate point position on image, shift by center position
    let x = mercX(lon) - cx;
    let y = mercY(lat) - cy;

    drawEQ(x, y, mag, depth);
  }

  // Draw series of empty circles to illustrate mag = 4, 5, 6, 7, 8, 9
  for (let m = 4; m < 9; m++) {
    push();
    noFill();
    stroke(0);
    strokeWeight(1);
    xs = [50, 80, 110, 150, 215];
    ys = [205, 205, 205, 205, 195];
    labels = ["0 - 4", "5", "6", "7", "8 or stronger"];
    if (m == 4) {
      msize = 1;
    } else {
      msize = 3 * pow(10, 0.3 * (m - 4));
    }
    ellipse(xs[m - 4], 220.5 - 0.5 * msize, msize);
    textAlign(CENTER, CENTER);
    textSize(12);
    noStroke();
    fill(0);
    text(labels[m - 4], xs[m - 4], 240);
    pop();
  }
  // Draw a horizontal bar with a gradient from red to yellow to green
  // to illustrate the depth coloring of the quake points
  let ygtop = 220;
  let ygbot = 225;
  let c1 = color(255, 0, 0);
  let c2 = color(255, 255, 0);
  let c3 = color(0, 255, 0);
  for (let xg = 275; xg < 326; xg++) {
    let inter = map(xg, 275, 325, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(xg, ygtop, xg, ygbot);
  }
  for (let xg = 326; xg < 376; xg++) {
    let inter = map(xg, 326, 375, 0, 1);
    let c = lerpColor(c2, c3, inter);
    stroke(c);
    line(xg, ygtop, xg, ygbot);
  }
  // Then label the depth with tick marks and text
  stroke(0);
  strokeWeight(1);
  line(275, 225, 275, 213);
  line(325, 217, 325, 213);
  line(375, 225, 375, 213);
  noStroke();
  textAlign(CENTER, CENTER);
  text("0", 275, 205);
  text("50", 325, 205);
  text("100", 375, 205);
  text("Depth (km)", 325, 190);
}

// Using WebMercator projection for simplicity
// Should generate better map and define new coordinate transforms

// Convert Longitude in degrees to pixel x-coordinate
function mercX(lon) {
  let rlon = radians(lon);
  let a = (256 / PI) * pow(2, zoom);
  let b = rlon + PI;
  return a * b;
}

// Convert Latitude in degrees to pixel y-coordinate
function mercY(lat) {
  let rlat = radians(lat);
  let a = (256 / PI) * pow(2, zoom);
  let b = tan(PI / 4 + rlat / 2);
  let c = PI - log(b);
  return a * c;
}

// Draw earthquake based on its magnitude
// color must be an rgba color value
function drawEQ(x, y, mag, depth) {
  let size;
  if (mag <= 4) {
    size = 1;
  } else if (mag >= 4 && mag <= 8) {
    size = 3 * pow(10, 0.3 * (mag - 4))
    //  size = 0.5 * pow(10, 0.5 * (mag - 3.5));
  } else if (mag > 8) {
    mag = 8;
    size = 3 * pow(10, 0.3 * (mag - 4));
    //  size = 0.5 * pow(10, 0.5 * (mag - 3.5));
  }

  if (mag > 6) {
    console.log(x, y, mag, size);
  }

  // Define color of earthquake based on its depth
  // Map of red, yellow, green from depth of zero to 100 km
  let rval = map(float(depth), 50, 100, 255, 0, true);
  let gval = map(float(depth), 0, 50, 0, 255, true);

  // If magnitude <= 8, draw a filled colored disk
  // If magnitude > 8, draw a different symbol
  //  For now, a filled colored disk with a black outline
  if (mag <= 8) {
    push();
    fill(rval, gval, 0, 127);
    noStroke();
  } else {
    push();
    fill(rval, gval, 0, 127);
    stroke(0);
    strokeWeight(1);
  }
  if (isFinite(x) && isFinite(y) && isFinite(size)) {
    ellipse(x, y, size);
  }
  pop();
}