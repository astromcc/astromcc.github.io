/******************************************************************************
 *** BEGIN STELLAR PARALLAX
 ******************************************************************************/
var par = {
  p: document.getElementById("par_p"),
  d: document.getElementById("par_d"),
  solve: document.getElementById("par_solve"),
  clear: document.getElementById("par_clear"),
  warn: document.getElementById("par_warn"),
  pevent: "",
  devent: ""
}

// Calculate and display missing value or
// warn if both input fields are filled.
let parSolve = function() {

  // Both parallax and distance filled => give warning
  if (par.p.value != "" && par.d.value != "") {
    par.warn.innerHTML = "No empty cell!";

    // Parallax provided, distance empty => calculate distance
    // Format distance as a float, rounded to 4 digits
  } else if (par.p.value != "" && par.d.value == "") {
    par.warn.innerHTML = "";
    let parallax = parseFloat(par.p.value);
    let distance = 1 / parallax;
    par.d.value = parseFloat(distance.toExponential(3));

    // Parallax empty, distance provided => calculate parallax
    // Format parallax > 0.001 as a decimal to 3 significant figures
    // Format parallax < 0.001 in scientific notation to 3 sig figs
  } else if (par.p.value == "" && par.d.value != "") {
    par.warn.innerHTML = "";
    let distance = parseFloat(par.d.value);
    let parallax = 1 / distance;
    if (parallax >= 0.001) {
      par.p.value = parseFloat(parallax.toExponential(3));
    } else {
      par.p.value = parallax.toExponential(3);
    }
  }
}

// Delete text from temperature and wavelegnth input fields,
// reset wavelength unit to meters, unitPower to 1, clear warning message.
let parClear = function() {
  par.p.value = "";
  par.d.value = "";
  //par.wMeters = "";
  //par.units.value = "meters";
  par.warn.innerHTML = "";
}

// Catch presses of Enter key, pass on to wienSolve function
let parEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    parSolve();
  }
}

par.pevent = par.p.addEventListener("keypress", parEnter);
par.devent = par.d.addEventListener("keypress", parEnter);
par.solve.addEventListener("click", parSolve);
par.clear.addEventListener("click", parClear);
//par.units.addEventListener("change", parUnits);

/******************************************************************************
 *** END STELLAR PARALLAX
 ******************************************************************************/


/******************************************************************************
 *** BEGIN MAGNITUDE-DISTANCE
 ******************************************************************************/
var mmd = {
  app: document.getElementById("mmd_app"),
  abs: document.getElementById("mmd_abs"),
  d: document.getElementById("mmd_d"),
  solve: document.getElementById("mmd_solve"),
  clear: document.getElementById("mmd_clear"),
  warn: document.getElementById("mmd_warn"),
  appevent: "",
  absevent: "",
  devent: ""
}

// Calculate and display missing value or
// warn if both input fields are filled.
let mmdSolve = function() {

  // Check which input fields are empty
  let appempty = mmd.app.value == ""
  let absempty = mmd.abs.value == ""
  let dempty = mmd.d.value == ""

  // Only one field filled, need 2 to solve => give warning
  if (!appempty && absempty && dempty) {
    mmd.warn.innerHTML = "Need 1 empty cell!";
  } else if (appempty && !absempty && dempty) {
    mmd.warn.innerHTML = "Need 1 empty cell!";
  } else if (appempty && absempty && !dempty) {
    mmd.warn.innerHTML = "Need 1 empty cell!";

    // All of apparent mag, absolute mag, and distance filled => give warning
  } else if (!appempty && !absempty && !dempty) {
    mmd.warn.innerHTML = "No empty cell!";

    // App mag empty, abs mag and distance provided => calculate app mag
    // Round app mag to 2 decimal places
  } else if (appempty && !absempty && !dempty) {
    mmd.warn.innerHTML = "";
    let absmag = parseFloat(mmd.abs.value);
    let distance = parseFloat(mmd.d.value);
    let appmag = absmag + 5 * Math.log10(distance) - 5;
    mmd.app.value = parseFloat(appmag.toExponential(2));

    // Abs mag empty, app mag and distance provided => calculate abs mag
    // Round abs mag to 2 decimal places
  } else if (!appempty && absempty && !dempty) {
    mmd.warn.innerHTML = "";
    let appmag = parseFloat(mmd.app.value);
    let distance = parseFloat(mmd.d.value);
    let absmag = appmag - 5 * Math.log10(distance) + 5;
    mmd.abs.value = parseFloat(absmag.toExponential(2));

    // Radius empty, luminosity and temperature provided => calculate radius
    // Format distance rounded to 3 significant figures
  } else if (!appempty && !absempty && dempty) {
    mmd.warn.innerHTML = "";
    let appmag = parseFloat(mmd.app.value);
    let absmag = parseFloat(mmd.abs.value);
    let distmod = (appmag - absmag + 5) / 5;
    let distance = 10 ** distmod;
    mmd.d.value = parseFloat(distance.toExponential(2));
  }
}

// Delete text from luminosity, temperature, and radius input fields,
// reset radius unit to solar radii, unitsPower to 1, clear warning message.
let mmdClear = function() {
  mmd.app.value = "";
  mmd.abs.value = "";
  mmd.d.value = "";
  mmd.warn.innerHTML = "";
}

// Catch presses of Enter key, pass on to ltrSolve function
let mmdEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    mmdSolve();
  }
}

// Define events for Magnitude-Distance
mmd.appevent = mmd.app.addEventListener("keypress", mmdEnter);
mmd.absevent = mmd.abs.addEventListener("keypress", mmdEnter);
mmd.devent = mmd.d.addEventListener("keypress", mmdEnter);
mmd.solve.addEventListener("click", mmdSolve);
mmd.clear.addEventListener("click", mmdClear);

/******************************************************************************
 *** END MAGNITUDE-DISTANCE
 ******************************************************************************/


/******************************************************************************
 *** BEGIN WIEN'S LAW
 ******************************************************************************/
var wien = {
  t: document.getElementById("wien_t"),
  w: document.getElementById("wien_w"),
  wMeters: "",
  solve: document.getElementById("wien_solve"),
  clear: document.getElementById("wien_clear"),
  units: document.getElementById("wien_units"),
  warn: document.getElementById("wien_warn"),
  tevent: "",
  wevent: ""
}

// Calculate and display missing value or
// warn if both input fields are filled.
let wienSolve = function() {

  // Both temperature and wavelength filled => give warning
  if (wien.t.value != "" && wien.w.value != "") {
    wien.warn.innerHTML = "No empty cell!";

    // Temperature provided, wavelength empty => calculate wavelength
    // Format wavelength in scientific notation, rounded to 4 digits
  } else if (wien.t.value != "" && wien.w.value == "") {
    wien.warn.innerHTML = "";
    let temperature = parseFloat(wien.t.value);
    wien.wMeters = 2.9e-3 / temperature;
    wien.w.value = wien.wMeters.toExponential(3);

    // Temperature empty, wavelength provided => calculate temperature
    // Format temperature rounded to 4 significant figures
  } else if (wien.t.value == "" && wien.w.value != "") {
    wien.warn.innerHTML = "";
    let wavelength = parseFloat(wien.w.value);
    let unitsPower = powerLengthUnit(wien.units.value);
    wien.wMeters = wavelength * unitsPower;
    let temperature = (2.9e-3 / wien.wMeters).toExponential(3);
    wien.t.value = parseFloat(temperature);
  }
}

// Delete text from temperature and wavelegnth input fields,
// reset wavelength unit to meters, unitPower to 1, clear warning message.
let wienClear = function() {
  wien.t.value = "";
  wien.w.value = "";
  wien.wMeters = "";
  wien.units.value = "meters";
  wien.warn.innerHTML = "";
}

// Length unit menu change => express wavelength in selected length units
let wienUnits = function() {
  //  console.log(wien.units.value);
  if (wien.w.value != "") {
    let unitsPower = powerLengthUnit(wien.units.value);
    let newW = wien.wMeters / unitsPower;
    // Round value to 4 significant figures for display
    if (newW > 1e-3) {
      let sigfigs = newW.toExponential(3);
      wien.w.value = parseFloat(sigfigs);
    } else {
      wien.w.value = newW.toExponential(3);
    }
  }
}

// Catch presses of Enter key, pass on to wienSolve function
let wienEnter = function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    wienSolve();
  }
}

wien.tevent = wien.t.addEventListener("keypress", wienEnter);
wien.wevent = wien.w.addEventListener("keypress", wienEnter);
wien.solve.addEventListener("click", wienSolve);
wien.clear.addEventListener("click", wienClear);
wien.units.addEventListener("change", wienUnits);

/******************************************************************************
 *** END WIEN'S LAW
 ******************************************************************************/


/******************************************************************************
 *** BEGIN LUMINOSITY-TEMPERATURE-RADIUS
 ******************************************************************************/
const solarradius = 6.96e8;

var ltr = {
  lu: document.getElementById("ltr_lu"),
  t: document.getElementById("ltr_t"),
  r: document.getElementById("ltr_r"),
  rMeters: "",
  solve: document.getElementById("ltr_solve"),
  clear: document.getElementById("ltr_clear"),
  units: document.getElementById("ltr_units"),
  warn: document.getElementById("ltr_warn"),
  luevent: "",
  tevent: "",
  revent: ""
}

// Calculate and display missing value or
// warn if both input fields are filled.
let ltrSolve = function() {

  // Check which input fields are empty
  let luempty = ltr.lu.value == ""
  let tempty = ltr.t.value == ""
  let rempty = ltr.r.value == ""

  // Only one field filled, need 2 to solve => give warning
  if (!luempty && tempty && rempty) {
    ltr.warn.innerHTML = "Need 1 empty cell!";
  } else if (luempty && !tempty && rempty) {
    ltr.warn.innerHTML = "Need 1 empty cell!";
  } else if (luempty && tempty && !rempty) {
    ltr.warn.innerHTML = "Need 1 empty cell!";

    // All of luminosity, temperature, and radius filled => give warning
  } else if (!luempty && !tempty && !rempty) {
    ltr.warn.innerHTML = "No empty cell!";

    // luminosity empty, temperature and radius provided => calculate luminosity
    // Format luminosity in scientific notation, rounded to 4 digits
  } else if (luempty && !tempty && !rempty) {
    ltr.warn.innerHTML = "";
    let temperature = parseFloat(ltr.t.value);
    let radius = parseFloat(ltr.r.value);
    let unitsPower = powerLengthUnit(ltr.units.value);
    ltr.rMeters = radius * unitsPower;
    luminosity = (temperature / 5800) ** 4 * (ltr.rMeters / solarradius) ** 2;
    ltr.lu.value = parseFloat(luminosity.toExponential(2));

    // Temperature empty, luminosity and radius provided => calculate temperature
    // Format temperature rounded to nearest kelvin
  } else if (!luempty && tempty && !rempty) {
    ltr.warn.innerHTML = "";
    let luminosity = parseFloat(ltr.lu.value);
    let radius = parseFloat(ltr.r.value);
    let unitsPower = powerLengthUnit(ltr.units.value);
    ltr.rMeters = radius * unitsPower;
    let temperature = 5800 * luminosity ** (0.25) / (ltr.rMeters / solarradius) ** (0.5);
    ltr.t.value = parseFloat(temperature.toExponential(2));

    // Radius empty, luminosity and temperature provided => calculate radius
    // Format radius rounded to 2 significant figures
  } else if (!luempty && !tempty && rempty) {
    ltr.warn.innerHTML = "";
    let luminosity = parseFloat(ltr.lu.value);
    let temperature = parseFloat(ltr.t.value);
    // radius in meters
    ltr.rMeters = solarradius * luminosity ** 0.5 / (temperature / 5800) ** 2;
    let unitsPower = powerLengthUnit(ltr.units.value);
    let radius = ltr.rMeters / unitsPower;
    ltr.r.value = parseFloat(radius.toExponential(2));
  }
}

// Delete text from luminosity, temperature, and radius input fields,
// reset radius unit to solar radii, unitsPower to 1, clear warning message.
let ltrClear = function() {
  ltr.lu.value = "";
  ltr.t.value = "";
  ltr.r.value = "";
  ltr.rMeters = "";
  ltr.units.value = "solar radii";
  ltr.warn.innerHTML = "";
}

// Length unit menu change => express wavelength in selected length units
let ltrUnits = function() {
  console.log(ltr.units.value);
  if (ltr.r.value != "") {
    let unitsPower = powerLengthUnit(ltr.units.value);
    let newR = ltr.rMeters / unitsPower;
    console.log(unitsPower, newR);
    // Round value to 4 significant figures for display
    if (newR > 1e-3) {
      let sigfigs = newR.toExponential(3);
      ltr.r.value = parseFloat(sigfigs);
    } else {
      ltr.r.value = newR.toExponential(3);
    }
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
ltr.units.addEventListener("change", ltrUnits);

/******************************************************************************
 *** END LUMINOSITY-TEMPERATURE-RADIUS
 ******************************************************************************/


/******************************************************************************
 *** OTHER FUNCTIONS
 ******************************************************************************/

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
      return 6.96e8;
    case "AU":
      return 1.5e11;
  }
}