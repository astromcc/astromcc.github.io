// Using a odd-q arrangement with hexes aligned in columns
// Hexes in odd-numbered columns displaced down by half a hex
// Hexes in the x direction are separated by 1.5 hexsides
//  One hexside from center to edge, half a hex of top/bottom edge of neigbhor
// Hexes in the y direction are separated by a hexside times sqrt(3)

function Hex(i, j, r, a, s, g) {
  if (i % 2 == 0) {
    yloc = j * r * sr3 + 1;
  } else {
    yloc = (j + 0.5) * r * sr3 + 1;
  }
  this.i = i,
    this.j = j,
    this.r = r,
    this.x = 1.5 * i * r,
    this.y = yloc,
    this.r = r,
    this.march = [false, false, false, false, false, false],
    this.marching = [false, false, false, false, false, false],
    this.amt = a,
    this.side = s,
    this.growth = g
}

Hex.prototype.show = function() {
  polygon(this.x, this.y, this.r, 6);
}

Hex.prototype.showFarms = function() {
  if (this.growth > 0) {
    push();
    strokeWeight(1);
    noFill();
    ellipse(this.x, this.y, this.r * 0.7, this.r * 0.7);
    pop();
  }
}

Hex.prototype.showAmt = function() {
  if (this.side != 0) {
    push();
    noStroke();
    switch (this.side) {
      case 1:
        fill(color(230, 0, 0));
        break;
      case 2:
        fill(color(0, 0, 230));
        break;
      case 3:
        fill(color(0, 230, 0));
        break;
      case 4:
        fill(color(230, 230, 0));
        break;
    }
    // Math.sqrt or not?
    rad = 1.25 * (this.amt / capacity) * hsz;
    ellipse(this.x, this.y, rad, rad);
    pop();
  }
}

// Draw the march vectors for each hex
Hex.prototype.showMarch = function() {
  var inner = 0.4;
  var outer = 0.75;
  var dfx = this.r * sr3 / 2;
  var dfy = this.r / 2;
  push();
  strokeWeight(3);
  if (this.march[0]) {
    if (this.marching[0]) {
      stroke(255);
    }
    x0 = this.x;
    x1 = this.x;
    y0 = lerp(this.y, this.y - this.r, inner);
    y1 = lerp(this.y, this.y - this.r, outer);
    line(x0, y0, x1, y1);
    this.marching[0] = false;
  }
  if (this.march[1]) {
    if (this.marching[1]) {
      stroke(255);
    }
    x0 = lerp(this.x, this.x + dfx, inner);
    x1 = lerp(this.x, this.x + dfx, outer);
    y0 = lerp(this.y, this.y - dfy, inner);
    y1 = lerp(this.y, this.y - dfy, outer);
    line(x0, y0, x1, y1);
    this.marching[1] = false;
  }
  if (this.march[2]) {
    if (this.marching[2]) {
      stroke(255);
    }
    x0 = lerp(this.x, this.x + dfx, inner);
    x1 = lerp(this.x, this.x + dfx, outer);
    y0 = lerp(this.y, this.y + dfy, inner);
    y1 = lerp(this.y, this.y + dfy, outer);
    line(x0, y0, x1, y1);
    this.marching[2] = false;
  }
  if (this.march[3]) {
    if (this.marching[3]) {
      stroke(255);
    }
    x0 = this.x;
    x1 = this.x;
    y0 = lerp(this.y, this.y + this.r, inner);
    y1 = lerp(this.y, this.y + this.r, outer);
    line(x0, y0, x1, y1);
    this.marching[3] = false;
  }
  if (this.march[4]) {
    if (this.marching[4]) {
      stroke(255);
    }
    x0 = lerp(this.x, this.x - dfx, inner);
    x1 = lerp(this.x, this.x - dfx, outer);
    y0 = lerp(this.y, this.y + dfy, inner);
    y1 = lerp(this.y, this.y + dfy, outer);
    line(x0, y0, x1, y1);
    this.marching[4] = false;
  }
  if (this.march[5]) {
    if (this.marching[5]) {
      stroke(255);
    }
    x0 = lerp(this.x, this.x - dfx, inner);
    x1 = lerp(this.x, this.x - dfx, outer);
    y0 = lerp(this.y, this.y - dfy, inner);
    y1 = lerp(this.y, this.y - dfy, outer);
    line(x0, y0, x1, y1);
    this.marching[5] = false;
  }
  pop();
}

// Draw a polygon at x,y with radius and npoints
// algorithm taken from the p5js reference docs
function polygon(x, y, radius, npoints) {
  push();
  strokeWeight(1);
  stroke(0);
  // noFill();
  fill(127);
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
  pop();
}

// Borrowed from redblobgames.com/grids/hexagons
// Game grid is "odd-q" arrangement per the website's definition
// That is, vertical columns of hexes with a vertical offset of one hex
// between the even and odd columns
// This means that the 6 neighbors will have different offsets in col, row
// depending on whether the home hex is in an even or odd column
var oddq_directions = [
  [
    [0, -1],
    [+1, -1],
    [+1, 0],
    [0, +1],
    [-1, 0],
    [-1, -1]
  ],
  [
    [0, -1],
    [+1, 0],
    [+1, +1],
    [0, +1],
    [-1, +1],
    [-1, 0]
  ]
]
// The "direction" value in the neighbor function is defined like sectors
// for the march vectors: Sector 0 is top, then clockwise around hex center
//        0
//     5     1
//     4     2
//        3
function oddq_offset_neighbor(i, j, direction) {
  var parity = i & 1;
  var dir = oddq_directions[parity][direction];
  return [i + dir[0], j + dir[1]];
}