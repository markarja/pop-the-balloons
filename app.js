var POP_IMAGE = "res/pop.png";
var POP_AUDIO = "res/pop.mp3";
var scores = {
	"b0" : 500, "b1" : 300, "b2" : 600,
	"b3" : 100, "b4" : 1000, "b5" : -600
};
var balloonWorkers = new Array();
var workerStates = new Array();

function init() {
	
	var backgroundWorker = new Worker("background.js");
	backgroundWorker.onmessage = function(event) {
		document.getElementById("background")
			.style.backgroundPosition = event.data + "px";
	};
	
	for(var i = 0;i < 6;i++) {
		document.getElementById("b" + i).style.position = "absolute";
		document.getElementById("b" + i).style.bottom = "-260px";
		workerStates.push(0);
		balloonWorkers.push(null);
	}
	
	var balloon = 0;
	
	var interval = setInterval(function() {
		if(workerStates[balloon] == 0) {
			balloonWorkers[balloon] = new Worker("b" + balloon + ".js");
			workerStates[balloon] = 1;
			balloonWorkers[balloon].onmessage = function(event) {
				if(event.data.y > window.innerHeight || 
					document.getElementById("b" + event.data.b).src.indexOf(POP_IMAGE) > -1) {
					this.terminate();
					workerStates[event.data.b] = 0;
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
	var image = document.getElementById(id);
	playAudio(POP_AUDIO, true);
	image.src = POP_IMAGE;
	var timeout = setTimeout(function() {
		image.style.visibility = "hidden";
		image.src = "res/" + id + ".png";
		image.style.bottom = "-260px";
		image.style.visibility = "visible";
	}, 300);
	document.getElementById("score").innerHTML =
		(document.getElementById("score").innerHTML * 1 + scores[id]);
}

function playAudio(audioSource, audio) {
	if(audio) {
		document.getElementById("audioplayer").src = audioSource;
		var audio = document.getElementById("audioplayer");
		if(typeof device != "undefined" && device.platform == "Android") {
			audio = new Media("/android_asset/www/" + audioSource, 
					function() { audio.release(); }
					, onAudioError);
			audio.play();	
		} else {
			audio.play();
		}
	}
}