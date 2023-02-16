var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

/******************************************************************************
 *** BEGIN STELLAR PARALLAX
 ******************************************************************************/
var par = {
  // Get parallax text box
  p: document.getElementById("par_p"),
  // Get distance text box
  d: document.getElementById("par_d"),
  // Get solve button
  solve: document.getElementById("par_solve"),
  // Get clear button
  clear: document.getElementById("par_clear"),
  // Get warning text field
  warn: document.getElementById("par_warn"),
  // Set parallax and distance text boxes to empty
  pevent: "",
  devent: ""
}

// Calculate and display missing value or
// warn if not enough values are provided
// or no empty text box to solve for.
let parSolve = function() {

  // Check which text boxes are empty
  let pempty = par.p.value == "";
  let dempty = par.d.value == "";

  // Sum empty flags
  let parempties = pempty + dempty;

  // Test empty text box configurations
  if (parempties == 0) {
    // If 0 text boxes are empty, no value to solve for.
    par.warn.innerHTML = "Provide 1 empty cell to solve.";
  } else if (parempties == 1) {
    // If exactly 1 text box is empty, can solve for other value.
    if (pempty) {
      // If parallax text box is empty,
      // Clear warning message
      par.warn.innerHTML = "";
      // Get distance value and solve for parallax
      let distance = parseFloat(par.d.value);
      let parallax = 1 / distance;
      // If parallax > 0.001, round parallax to decimal with 4 sig figs
      if (parallax >= 0.001) {
        par.p.value = parseFloat(parallax.toExponential(3));
      // Else format parallax in sci not. with 4 sig figs
      } else {
        par.p.value = parallax.toExponential(3);
      }
    } else if (dempty) {
      // If distance text box is empty,
      // Clear warning message
      par.warn.innerHTML = "";
      // Get parallax value and solve for distance
      let parallax = parseFloat(par.p.value);
      let distance = 1 / parallax;
      // Format distance as float and round to 4 digits
      par.d.value = parseFloat(distance.toExponential(3));
    }
  } else if (parempties == 2) {
    // If both text boxes are empty, not enough values to solve for 3rd value.
    par.warn.innerHTML = "Provide exactly 1 value.";
  }
}

// When Clear button is pressed:
// Delete text from parallax and distance text boxes
// and clear warning message.
let parClear = function() {
  par.p.value = "";
  par.d.value = "";
  par.warn.innerHTML = "";
}

// Catch presses of Enter key, pass to parSolve function
let parEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    parSolve();
  }
}

// Add listeners to catch keypresses in parallax and distance text boxes
par.pevent = par.p.addEventListener("keypress", parEnter);
par.devent = par.d.addEventListener("keypress", parEnter);
// Add listeners to catch Solve and Clear button presses
par.solve.addEventListener("click", parSolve);
par.clear.addEventListener("click", parClear);

/******************************************************************************
 *** END STELLAR PARALLAX
 ******************************************************************************/


/******************************************************************************
 *** BEGIN MAGNITUDE-DISTANCE
 ******************************************************************************/
var mmd = {
  // Get apparent magnitude text box
  app: document.getElementById("mmd_app"),
  // Get absolute magnitude text box
  abs: document.getElementById("mmd_abs"),
  // Get distance text box
  d: document.getElementById("mmd_d"),
  // Get solve button
  solve: document.getElementById("mmd_solve"),
  // Get clear button
  clear: document.getElementById("mmd_clear"),
  // Get warning text field
  warn: document.getElementById("mmd_warn"),
  // Ready listener placeholders for app mag, abs mag, and distance text boxes
  appevent: "",
  absevent: "",
  devent: ""
}

// Calculate and display missing value or
// warn if not enough values are provided.
let mmdSolve = function() {

  // Check which text boxes are empty
  let appempty = mmd.app.value == "";
  let absempty = mmd.abs.value == "";
  let dempty = mmd.d.value == "";

  // Sum empty flags
  let mmdempties = appempty + absempty + dempty;

  // Test empty text box configurations
  if (mmdempties == 0) {
    // If 0 text boxes are empty, no value to solve for.
    mmd.warn.innerHTML = "Provide 1 empty cell to solve.";
  } else if (mmdempties == 1) {
  // If exactly 1 text box is empty, can solve for third value.
    if (appempty) {
      // If apparent magnitude text box is empty,
      // Clear warning message
      mmd.warn.innerHTML = "";
      // Get absolute magnitude and distance values
      let absmag = parseFloat(mmd.abs.value);
      let distance = parseFloat(mmd.d.value);
      // Then solve for apparent magnitude and round to 2 decimal places
      let appmag = absmag + 5 * Math.log10(distance) - 5;
      mmd.app.value = parseFloat(appmag.toExponential(2));
    } else if (absempty) {
      // Get m and d, solve for absolute magnitude, rounding to 2 decimal places
      mmd.warn.innerHTML = "";
      let appmag = parseFloat(mmd.app.value);
      let distance = parseFloat(mmd.d.value);
      let absmag = appmag - 5 * Math.log10(distance) + 5;
      mmd.abs.value = parseFloat(absmag.toExponential(2));
    } else if (dempty) {
      // Get m and M, solve for distance, rounding to 2 decimal places
      mmd.warn.innerHTML = "";
      let appmag = parseFloat(mmd.app.value);
      let absmag = parseFloat(mmd.abs.value);
      let distmod = (appmag - absmag + 5) / 5;
      let distance = 10 ** distmod;
      mmd.d.value = parseFloat(distance.toExponential(2));
    }
  } else if (mmdempties == 2 || mmdempties == 3) {
    // If 2 or 3 text boxes are empty, not enough values to solve for 3rd value.
    mmd.warn.innerHTML = "Provide exactly 2 values.";
  }
}

// When Clear button is pressed:
// Delete text from app mag, abs mag, and distance text boxes
// and clear warning message.
let mmdClear = function() {
  mmd.app.value = "";
  mmd.abs.value = "";
  mmd.d.value = "";
  mmd.warn.innerHTML = "";
}

// Catch presses of Enter key, pass to mmdSolve function
let mmdEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    mmdSolve();
  }
}

// Add listeners to catch keypresses in app mag, abs mag, distance text boxes
mmd.appevent = mmd.app.addEventListener("keypress", mmdEnter);
mmd.absevent = mmd.abs.addEventListener("keypress", mmdEnter);
mmd.devent = mmd.d.addEventListener("keypress", mmdEnter);
// Add listeners to catch Solve and Clear button presses
mmd.solve.addEventListener("click", mmdSolve);
mmd.clear.addEventListener("click", mmdClear);

/******************************************************************************
 *** END MAGNITUDE-DISTANCE
 ******************************************************************************/


/******************************************************************************
 *** BEGIN WIEN'S LAW
 ******************************************************************************/
var wien = {
  // Get temperature text box
  t: document.getElementById("wien_t"),
  // Get wavelength text box
  w: document.getElementById("wien_w"),
  // Get solve button
  solve: document.getElementById("wien_solve"),
  // Get clear button
  clear: document.getElementById("wien_clear"),
  // Get unit dropdown
  unit: document.getElementById("wien_unit"),
  // Get warn text field
  warn: document.getElementById("wien_warn"),
  // Ready listener placeholders for temperature and wavelength text boxes
  tevent: "",
  wevent: "",
  // Set wavelength unit current selection, default "meters"
  curunit: "meters"
}

// Calculate and display missing value or
// warn if not enough values are provided
// or no empty text box to solve for.
let wienSolve = function() {

  // Check which text boxes are empty
  let tempty = wien.t.value == "";
  let wempty = wien.w.value == "";

  // Sum empty flags
  let wienempties = tempty + wempty;

  // Test empty text box configurations
  if (wienempties == 0) {
    // If 0 text boxes are empty, no value to solve for.
    wien.warn.innerHTML = "Provide 1 empty cell to solve.";
  } else if (wienempties == 1) {
    // If exactly 1 text box is empty, can solve for missing value.
    if (tempty) {
      // If temperature text box is empty,
      // Clear warning message
      wien.warn.innerHTML = "";
      // Get wavelength value and wavelength unit
      let wl_scaled = parseFloat(wien.w.value);
      let unitPower = powerLengthUnit(wien.unit.value);
      let wl_meters = wl_scaled * unitPower;
      let temperature = (2.898e-3 / wl_meters);
      wien.t.value = parseFloat(temperature.toExponential(3));
    } else if (wempty) {
      // If wavelength text box is empty,
      // Clear warning message
      wien.warn.innerHTML = "";
      // Get temperature value and wavelength unit
      let temperature = parseFloat(wien.t.value);
      let unitPower = powerLengthUnit(wien.unit.value);
      let wl_meters = (2.898e-3 / temperature);
      let wl_scaled = wl_meters / unitPower;
      wien.w.value = numFormat(wl_scaled);
    }
  } else if (wienempties == 2) {
    // If both text boxes are empty, not enough values to solve for 3rd value.
    par.warn.innerHTML = "Provide exactly 1 value.";
  }
}

// If unit menu change, then express wavelength in selected unit
let wienUnit = function() {
  if (wien.w.value != "") {
    // Get exponent before and after dropdown menu change
    let oldPower = powerLengthUnit(wien.curunit);
    let newPower = powerLengthUnit(wien.unit.value);
    // Set new current exponent to exponent selected in dropdown menu
    wien.curunit = wien.unit.value;
    // Scale displayed wavelength value by both exponents
    let wl_scaled = wien.w.value * oldPower / newPower;
    // Format wavelength value for display
    wien.w.value = numFormat(wl_scaled);
  }
}

// Delete text from temperature and wavelegnth input fields,
// reset wavelength unit to meters, unitPower to 1, clear warning message.
let wienClear = function() {
  wien.t.value = "";
  wien.w.value = "";
  wien.warn.innerHTML = "";
}

// Catch presses of Enter key, pass on to wienSolve function
let wienEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    wienSolve();
  }
}

// Add listeners to catch keypresses in temperature and wavelength text boxes
wien.tevent = wien.t.addEventListener("keypress", wienEnter);
wien.wevent = wien.w.addEventListener("keypress", wienEnter);
// Add listeners to catch Solve and Clear button presses
// and change in Wavelength unit dropdown menu
wien.solve.addEventListener("click", wienSolve);
wien.clear.addEventListener("click", wienClear);
wien.unit.addEventListener("change", wienUnit);

// Function powerLengthUnit is defined at bottom of file.

/******************************************************************************
 *** END WIEN'S LAW
 ******************************************************************************/


/******************************************************************************
 *** BEGIN LUMINOSITY-TEMPERATURE-RADIUS
 ******************************************************************************/
const solarradius = 6.96e8; // Solar radius in meters

var ltr = {
  // Get luminosity text box
  lu: document.getElementById("ltr_lu"),
  // Get temperature text box
  t: document.getElementById("ltr_t"),
  // Get radius text box
  r: document.getElementById("ltr_r"),
  // Get solve button
  solve: document.getElementById("ltr_solve"),
  // Get clear button
  clear: document.getElementById("ltr_clear"),
  // Get unit dropdown
  unit: document.getElementById("ltr_unit"),
  // Get warn text field
  warn: document.getElementById("ltr_warn"),
  // Ready listener placeholders for luminosity, temperature, radius text boxes
  luevent: "",
  tevent: "",
  revent: "",
  // Set radius unit current selection, default "solar radii"
  curunit: "solar radii"
}

// Calculate and display missing value or
// warn if both input fields are filled.
let ltrSolve = function() {

  // Check which text boxes are empty
  let luempty = ltr.lu.value == ""
  let tempty = ltr.t.value == ""
  let rempty = ltr.r.value == ""

  // Sum empty flags
  let ltrempties = luempty + tempty + rempty;

  // Test empty text box configurations
  if (ltrempties == 0) {
    // If 0 text boxes are empty, no value to solve for
    ltr.warn.innerHTML = "Provide 1 empty cell to solve.";
  } else if (ltrempties == 1) {
    // If exactly 1 text box is empty, can solve for third value.
    if (luempty) {
      // If luminosity text box is empty,
      // Clear warning message
      ltr.warn.innerHTML = "";
      // Get temperature and radius values and radius unit
      let temperature = parseFloat(ltr.t.value);
      let r_scaled = parseFloat(ltr.r.value);
      let unitPower = powerLengthUnit(ltr.unit.value);
      // Calculate radius in meters
      let r_meters = r_scaled * unitPower;
      // Then solve for luminosity
      let luminosity = (temperature / 5800) ** 4 * (r_meters / solarradius) ** 2;
      // And format luminosity value for display
      ltr.lu.value = numFormat(luminosity);
    } else if (tempty) {
      // If temperature text box is empty,
      // Clear warning message
      ltr.warn.innerHTML = "";
      // Get luminosity and radius values and radius unit
      let luminosity = parseFloat(ltr.lu.value);
      let r_scaled = parseFloat(ltr.r.value);
      let unitPower = powerLengthUnit(ltr.unit.value);
      // Calculate radius in meters
      let r_meters = r_scaled * unitPower;
      // Then solve for temperature
      let temperature = 5800 * luminosity ** (0.25) / (r_meters / solarradius) ** (0.5);
      // And format temperature value for display
      ltr.t.value = temperature.toFixed(0);
    } else if (rempty) {
      // If temperature text box is empty,
      // Clear warning message
      ltr.warn.innerHTML = "";
      // Get luminosity and temperature values and radius unit
      let luminosity = parseFloat(ltr.lu.value);
      let temperature = parseFloat(ltr.t.value);
      let unitPower = powerLengthUnit(ltr.unit.value);
      // Then calculate stellar radius in meters
      r_meters = solarradius * luminosity ** 0.5 / (temperature / 5800) ** 2;
      // And format radius value for display, according to unit dropdown menu selection
      let r_scaled = r_meters / unitPower;
      ltr.r.value = numFormat(r_scaled);
    }
  } else if (ltrempties == 2 || ltrempties == 3) {
    // If 2 or 3 text boxes are empty, not enough values to solve for third value.
    ltr.warn.innerHTML = "Provide exactly 2 values.";
  }
}

// Delete text from luminosity, temperature, and radius input fields,
// reset radius unit to solar radii, unitsPower to 1, clear warning message.
let ltrClear = function() {
  ltr.lu.value = "";
  ltr.t.value = "";
  ltr.r.value = "";
  ltr.warn.innerHTML = "";
}

// If unit menu change, then express radius  in selected unit
let ltrUnit = function() {
  if (ltr.r.value != "") {
    // Get exponent before and after dropdown menu change
    let oldPower = powerLengthUnit(ltr.curunit);
    let newPower = powerLengthUnit(ltr.unit.value);
    // Set new current exponent to exponent selected in dropdown menu
    ltr.curunit = ltr.unit.value;
    // Scale displayed radius value by both exponents
    let r_scaled = ltr.r.value * oldPower / newPower;
    ltr.r.value = numFormat(r_scaled);
  }
}

// Catch presses of Enter key, pass on to ltrSolve function
let ltrEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    ltrSolve();
  }
}

ltr.luevent = ltr.lu.addEventListener("keypress", ltrEnter);
ltr.tevent = ltr.t.addEventListener("keypress", ltrEnter);
ltr.revent = ltr.r.addEventListener("keypress", ltrEnter);
ltr.solve.addEventListener("click", ltrSolve);
ltr.clear.addEventListener("click", ltrClear);
ltr.unit.addEventListener("change", ltrUnit);

/******************************************************************************
 *** END LUMINOSITY-TEMPERATURE-RADIUS
 ******************************************************************************/


/******************************************************************************
 *** OTHER FUNCTIONS
 ******************************************************************************/

// Format wavelength value for display
let numFormat = function(value) {
  if (value >= 1e5) {
    return value.toExponential(3);
  } else if (value >= 100.0) {
    return value.toFixed(0);
  } else if (value >= 10.0) {
    return value.toFixed(1);
  } else if (value >= 1.00) {
    return value.toFixed(2);
  } else if (value >= 0.01) {
    return value.toFixed(4);
  } else {
    return value.toExponential(3);
  }
}

// Retrieve power of ten associated with a unit of length.
function powerLengthUnit(word) {
  switch (word) {
    case "nanometers":
      return 1e-9;
    case "micrometers":
      return 1e-6;
    case "millimeters":
      return 1e-3;
    case "meters":
      return 1;
    case "kilometers":
      return 1e3;
    case "solar radii":
      return 6.957e8;
    case "AU":
      return 1.496e11;
  }
}