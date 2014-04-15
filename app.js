var POP_IMAGE = "res/pop.png";
var POP_AUDIO = "res/pop.mp3";
var MAX_SPEED = 10;
var scores = {
	"b0" : 500, "b1" : 300, "b2" : 600,
	"b3" : 100, "b4" : 1000, "b5" : -600
};
var balloonWorkers = new Array();
var workerStates = new Array();
var balloonSpeeds = new Array();

function init() {
	
	window.addEventListener("touchstart", function(event) {
		if(event.target.tagName == "HTML" || event.target.tagName == "BODY") {
			event.preventDefault();
        }
	} ,false);
	window.addEventListener("scroll",function() { window.scrollTo(0,0); }, false);
	
	var backgroundWorker = new Worker("background.js");
	backgroundWorker.onmessage = function(event) {
		document.getElementById("background")
			.style.backgroundPosition = event.data + "px";
	};
	
	for(var i = 0;i < 6;i++) {
		document.getElementById("b" + i).style.backgroundImage = "url(res/b" + i + ".png)";
		document.getElementById("b" + i).style.position = "absolute";
		document.getElementById("b" + i).style.bottom = "-260px";
		workerStates.push(0);
		balloonSpeeds.push(0);
		balloonWorkers.push(null);
	}
	
	var balloon = 0;
	
	var interval = setInterval(function() {
		if(workerStates[balloon] == 0) {
			balloonWorkers[balloon] = new Worker("balloon.js");
			var speed = Math.floor(Math.random() * MAX_SPEED - 1) + 1;
			var limit = Math.floor(Math.random() * window.innerWidth - 50) + 1;
			var startX = Math.floor(Math.random() * (window.innerWidth / 2)) + 1;
			balloonWorkers[balloon].postMessage({"b" : balloon, "x" : startX, "limit" : limit, "speed" : speed});
			workerStates[balloon] = 1;
			balloonSpeeds[balloon] = MAX_SPEED - speed;
			balloonWorkers[balloon].onmessage = function(event) {
				if(event.data.y > window.innerHeight || 
					document.getElementById("b" + event.data.b).style.backgroundImage.indexOf(POP_IMAGE) > -1) {
					this.terminate();
					workerStates[event.data.b] = 0;
					balloonSpeeds[event.data.b] = 0;
				} else {
					document.getElementById("b" + event.data.b).style.bottom = event.data.y + "px";
					document.getElementById("b" + event.data.b).style.left = event.data.x + "px";
				}
			};
			
			
		}
		balloon++;
		if(balloon > 5) {
			balloon = 0;
		}
		document.getElementById("time").innerHTML = 
			document.getElementById("time").innerHTML - 1;
		
		if(document.getElementById("time").innerHTML == 0) {
			clearInterval(interval);
			alert("Game Over!");
		}
		
	}, 1000);	
}

function pop(id) {
	var element = document.getElementById(id);
	var index = id.replace("b","").trim();
	playAudio(POP_AUDIO, true);
	element.style.backgroundImage = "url(" + POP_IMAGE + ")";
	var timeout = setTimeout(function() {
		element.style.visibility = "hidden";
		element.style.backgroundImage = "url(res/" + id + ".png)";
		element.style.bottom = "-260px";
		element.style.visibility = "visible";
	}, 300);
	document.getElementById("score").innerHTML =
		(document.getElementById("score").innerHTML * 1 + scores[id] * balloonSpeeds[index]);
}

function playAudio(audioSource, audio) {
	if(audio) {
		document.getElementById("audioplayer").src = audioSource;
		var audio = document.getElementById("audioplayer");
		if(typeof device != "undefined") {
			if(device.platform == "Android") {
				audio = new Media("/android_asset/www/" + audioSource, 
						function() { audio.release(); }
						, onAudioError);
			} else {
				audio = new Media(audioSource, 
						function() { audio.release(); }
						, onAudioError);
			}
			audio.play();	
		} else {
			audio.play();
		}
	}
}

function onAudioError() {
	alert("code: " + error.code + "\n" + 
          "message: " + error.message + "\n");
}