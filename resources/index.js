// https://api.nasa.gov/planetary/apod?api_key=eRxHvNITgzWEDalPGv9RCIMITTRtHa367Rz46K5O&date=2020-07-10
// Default date is TODAY

let req = new XMLHttpRequest();
let url = "https://api.nasa.gov/planetary/apod?api_key=";
let api_key = "eRxHvNITgzWEDalPGv9RCIMITTRtHa367Rz46K5O";
// Date() returns local date + time, but .toISOString() returns UTC date
// So offset time by timezone (in milliseconds), then use .toISOString()
// Cut
let date = new Date();
let datetime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
let today = datetime.split('T')[0];

// Construct and send GET url request
req.open("GET", url + api_key + "&date=" + today);
req.send();

req.addEventListener("load", function(){
	if(req.status == 200 && req.readyState == 4){
  	let response = JSON.parse(req.responseText);
//    console.log(response.url);
    document.getElementById("apod-title").textContent = response.title;
//    document.getElementById("date").textContent = response.date;
//		response.media_type = "video";
    if (response.media_type == "image") {
			document.getElementById("apod-image").src = response.url;
    } else {
			document.getElementById("apod-image").src = "resources/images/apod-default.jpg";
		}
  }
})
