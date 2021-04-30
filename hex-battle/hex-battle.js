// An attempt to resurrect the Unix game battle using HTML+JS.
//

// Create global variable to hold game grid
let grid;

// Number of players
let players = 3;
// Active player (for multiplayer mode)
var player = 1;

// Number of starting hexes per player
let starting = 4;
// Initial size of starting troops
let startAmt = 100;

// Flow rate of marching between neighboring hexes
let flowRate = 5;
let capacity = 100;

// Number of starting farms
let farms = 4;
// Growth rate of troops in a hex due to a farm
// Growth rate equal to attacks from 3 sides or
// Growth rate equal to filling 3 neigbhors at a time
let growth = flowRate * 3;

// Size of canvas
let canvasX = 1080;
let canvasY = 833;

// Size of hexes
let hsz = 30;
const sr3 = Math.sqrt(3);

let cols = Math.ceil(canvasX / (hsz * 1.5)) + 1;
let rows = Math.ceil(canvasY / (hsz * sr3));

function setup() {
  let canvas0 = createCanvas(canvasX, canvasY);
  canvas0.parent("p5canvas");
  frameRate(30);
  background(255);
  // Establish grid of hexes, all are empty initially
  grid = make2DArray(cols, rows);
  // Establish second grid for calculating updated amounts each frame
  next = make2DArray(cols, rows);
  // Calculate x,y positions of each hex
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Hex(i, j, hsz, 0, 0, 0, players);
      next[i][j] = 0;
    }
  }

  // Establish starting hexes for players
  for (var p = 1; p < players + 1; p++) {
    var s = 0;
    while (s < starting) {
      ip = floor(random(cols - 2)) + 1;
      jp = floor(random(rows - 2)) + 1;
      if (grid[ip][jp].amt == 0) {
        grid[ip][jp].amt = startAmt;
        grid[ip][jp].side = p;
        s++;
      }
    }
  }

  // Establish starting farms
  var f = 0;
  while (f < farms) {
    ifarm = floor(random(cols - 2)) + 1;
    jfarm = floor(random(rows - 2)) + 1;
    if (grid[ifarm][jfarm].amt == 0) {
      grid[ifarm][jfarm].growth = growth;
      f++;
    }
  }
}

function draw() {
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      // Draw blank hexes
      grid[i][j].show();
      // Draw troops as colored circles
      grid[i][j].showAmt();
      // Draw farms as empty black circles
      grid[i][j].showFarms();
      // Draw march vectors
      grid[i][j].showMarch();
      // Copy grid amts to next amts to prepare for updating
      next[i][j] = grid[i][j].amt;
    }
  }

  // Calculate shift in troops for each hex and its neighbors
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      updateAmt(i, j);
    }
  }

  // Copy updated amts back to each hex
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].amt = next[i][j];
    }
  }
}

// Identify hex containing mouse click and *toggle* march vector state
function mouseClicked() {
  var minDist = 1000;
  var hiti = -1;
  var hitj = -1;
  // Identify hex center closest to mouse click x,y
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      newDist = dist(mouseX, mouseY, grid[i][j].x, grid[i][j].y);
      if (newDist < minDist) {
        minDist = newDist;
        hiti = i;
        hitj = j;
      }
    }
  }
  console.log("Clicked in ", hiti, hitj);

  // Need to add a player test here
  // Right now any occupied hex accepts marching orders
  // In future, set march vector only if hex is occupied by player's troops
  //  if (grid[hiti][hitj].side == player) {
  if (grid[hiti][hitj].side != 0) {
    // Identify hex sector that contains mouse click x,y
    // Sector 0 is top, then clockwise around hex center
    //        0
    //     5     1
    //     4     2
    //        3
    var dx = mouseX - grid[hiti][hitj].x;
    var dy = mouseY - grid[hiti][hitj].y;
    if (dy < -2 * dx && dy < 2 * dx) { // Sector 0
      sec = 0;
    } else if (dy < 0 && dy > -2 * dx) { // Sector 1
      sec = 1;
    } else if (dy > 0 && dy < 2 * dx) { // Sector 2
      sec = 2;
    } else if (dy > 2 * dx && dy > -2 * dx) { // Sector 3
      sec = 3;
    } else if (dy > 0 && dy < -2 * dx) { // Sector 4
      sec = 4;
    } else if (dy < 0 && dy > 2 * dx) { // Sector 5
      sec = 5;
    }
    // If march vector is not off the board, then set march vector
    if (!(hiti == 0 || // No vectors at all in first column
        (hiti == 1 && sec == 4) || // No leftward vectors in second column
        (hiti == 1 && sec == 5) ||
        (hiti == cols - 2 && sec == 1) || // No rightward vectors in
        (hiti == cols - 2 && sec == 2) || // second-to-last column
        hiti == cols - 1 || // No vectors at all in last column
        (hiti % 2 == 0 && hitj == 0) || // No vectors at all in top row
        // No upper vectors in top row, odd columns
        (hiti % 2 == 1 && hitj == 0 && (sec == 0 || sec == 1 || sec == 5)) ||
        // No upward vectors in top row, even columns
        (hiti % 2 == 0 && hitj == 1 && sec == 0) ||
        // No downward vectors in bottom row, even columns
        (hiti % 2 == 0 && hitj == rows - 2 && sec == 3) ||
        // No lower vectors in bottom row, odd columns
        (hiti % 2 == 1 && hitj == rows - 2 &&
          (sec == 2 || sec == 3 || sec == 4)) ||
        // No lower vectors in bottom row, odd columns
        (hiti % 2 == 1 && hitj == rows - 1 &&
          (sec == 2 || sec == 3 || sec == 4)) ||
        // No vectors at all in last row
        (hiti % 2 == 0 && hitj == rows - 1))) {

      // If no march vector, toggle march to true in that hex side
      // If march vector, toggle march to false in that hex side
      if (!grid[hiti][hitj].march[sec]) {
        grid[hiti][hitj].march[sec] = true;
      } else {
        grid[hiti][hitj].march[sec] = false;
      }
    }
  }
}

// Amount in hex will increase
//  if the hex is an occupied farm or friendly neighbors march in
// Amount in hex will decrease
//  if troops march out or the hex is attacked by unfriendly neighbors
function updateAmt(i, j) {
  // FARMS
  // amt grows:
  // if hex is a farm (a hex with growth > 0)
  // if amt is less than capacity
  // if a player occupies the hex (no growth if unoccupied)
  if (grid[i][j].growth > 0 && grid[i][j].side != 0) {
    var freeSpace = capacity - next[i][j];
    next[i][j] += min(grid[i][j].growth, freeSpace);
  }

  // MARCHING BETWEEN HEX AND NEIGHBOR
  // Only test hexes that have all 6 neighbors on board
  if (i > 0 && i < cols - 1 && j > 0 && j < rows - 1) {
    // Loop over all neighbors in sector order, 0 top, then clockwise
    for (var dir = 0; dir < 6; dir++) {
      [ni, nj] = oddq_offset_neighbor(i, j, dir);
      // HEX MARCHING INTO NEIGHBOR and order not carried out
      if (grid[i][j].march[dir]) {
        //        console.log("Found a march order at", i, j, dir);
        // Four cases:
        //  if neighbor is unoccupied (then side changes and amt increases)
        //  if neighbor is friendly (then side unchanged and amt increases)
        if (grid[ni][nj].side == 0 || grid[ni][nj].side == grid[i][j].side) {
          //          console.log("Looks friendly");
          // Hex can lose at most its current amt, else loses flowRate
          var outStep = min(next[i][j], flowRate);
          // Neighbor can reach at most its capacity, else gains flowRate
          var inStep = min(capacity - next[ni][nj], flowRate);
          // Minimum of these two is amt marching from hex to neighbor
          flowAmt = min(outStep, inStep);
          if (flowAmt > 0) {
            // New neighbor amt incremented by amt from hex
            next[ni][nj] += flowAmt;
            // New hex amt decremented by amt to neighbor
            next[i][j] -= flowAmt;
            // New neighbor side = hex side (change or no change is the same)
            grid[ni][nj].side = grid[i][j].side;
            grid[i][j].marching[dir] = true;
          }
          // If neighbor is unfriendly, two possibilities:
          //  A. Neighbor amt is sufficient to survive attack,
          //     then side unchanged and amt decreases
          //  B. Neighbor amt decreases to zero due to attack,
          //     then side becomes zero
        } else if (grid[ni][nj].side != grid[i][j].side) {
          //          console.log("Looks unfriendly");
          // Hex can lose at most its current amt, else loses flowRate
          var outStep = min(next[i][j], flowRate);
          // Neighbor can lose at most its current amt, else loses flowRate
          var inStep = min(next[ni][nj], flowRate);
          // Minimum of these two is amt marching from hex to neighbor
          flowAmt = min(outStep, inStep);
          if (flowAmt > 0) {
            // Both hex and neighbor lose amt due to combat
            next[ni][nj] -= flowAmt;
            next[i][j] -= flowAmt;
            // If neighbor is emptied, it becomes unoccupied
            if (next[ni][nj] < 0.01) {
              grid[ni][nj].side = 0;
            }
            grid[i][j].marching[dir] = true;
          }
        }
      }
    }
  }
}

// Make a 2-dimensional array of things, initially empty
function make2DArray(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}