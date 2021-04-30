let galmap = document.getElementById("galmap");
let chosen = "002";

let imageswitch = function(choice) {
  //console.log(choice);
  if (choice != chosen) {
    galmap.src = "images/sdss-gals-redshift" + choice + ".png";
    document.getElementById("rs" + choice).classList.add("chosen");
    document.getElementById("rs" + chosen).classList.remove("chosen");
    // console.log(choice, chosen);
    chosen = choice;
  }
}

document.getElementById("rs002").addEventListener("click", function() {
  imageswitch("002") } );
document.getElementById("rs007").addEventListener("click", function() {
  imageswitch("007") } );
document.getElementById("rs012").addEventListener("click", function() {
  imageswitch("012") } );
document.getElementById("rs020").addEventListener("click", function() {
  imageswitch("020") } );
document.getElementById("rs040").addEventListener("click", function() {
  imageswitch("040") } );
document.getElementById("rs060").addEventListener("click", function() {
  imageswitch("060") } );
