var POP_IMAGE = "res/pop.png";
var POP_AUDIO = "res/pop.mp3";
var DEATH_BALLOON = "res/b6.png";
var MORE_TIME_BALLOON = "res/b7.png";
var MAX_SPEED = 3;
var MAX_BALLOONS = 6;

var points = {
	"b0" : 1, "b1" : 2, "b2" : 3,
	"b3" : 4, "b4" : 5, "b5" : -1
};

var balloonWorkers = new Array();
var workerStates = new Array();
var balloonSpeeds = new Array();

var gameover = false;

function init(restart) {
	
	gameover = false;
	
	if(!restart) {
	
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
		
		for(var i = 0;i < MAX_BALLOONS;i++) {
			workerStates.push(0);
			balloonSpeeds.push(0);
			balloonWorkers.push(null);
		}
		
	} 
	
	document.getElementById("time").innerHTML = 4;
	document.getElementById("score").innerHTML = 0;
	
	for(var i = 0;i < 6;i++) {
		document.getElementById("b" + i).style.backgroundImage = "url(res/b" + i + ".png)";
		document.getElementById("b" + i).style.position = "absolute";
		document.getElementById("b" + i).style.bottom = "-260px";
		document.getElementById("t" + i).style.bottom = "-360px";
	}
	
	document.getElementById("gameover").style.visibility = "hidden";
	document.getElementById("submitscore").style.visibility = "hidden";
	document.getElementById("restart").style.visibility = "hidden";
	document.getElementById("score-label").style.visibility = "visible";
	document.getElementById("score").style.visibility = "visible";
	document.getElementById("time-label").style.visibility = "visible";
	document.getElementById("time").style.visibility = "visible";
	document.getElementById("highscores").style.visibility = "hidden";
	document.getElementById("highscores-restart").style.visibility = "hidden";
	document.getElementById("enterplayername").className = "invisible";
	document.getElementById("playernameinput").className = "invisible";
	document.getElementById("submitscorebutton").className = "invisible";
	document.getElementById("or").className = "invisible";
	
	var balloon = 0;
	
	var interval = setInterval(function() {
		if(workerStates[balloon] == 0 && document.getElementById("time").innerHTML > 0) {
			balloonWorkers[balloon] = new Worker("balloon.js");
			var type = Math.floor(Math.random() * 20);
			if(type == 1) {
				document.getElementById("b" + balloon).style.backgroundImage = "url(" + DEATH_BALLOON + ")";
			} else if(type == 2) {
				document.getElementById("b" + balloon).style.backgroundImage = "url(" + MORE_TIME_BALLOON + ")";
			} else {
				document.getElementById("b" + balloon).style.backgroundImage = "url(res/b" + balloon + ".png)";
			}
			var speed = Math.floor(Math.random() * MAX_SPEED - 1) + 1;
			var limit = Math.floor(Math.random() * window.innerWidth) + 1;
			var startX = Math.floor(Math.random() * (window.innerWidth / 2)) + 1;
			if(limit < startX) limit = startX + 100;
			balloonWorkers[balloon].postMessage({"b" : balloon, "x" : startX, "limit" : limit, "speed" : speed, "maxspeed" : MAX_SPEED});
			workerStates[balloon] = 1;
			balloonSpeeds[balloon] = (MAX_SPEED - speed) + 2;
			balloonWorkers[balloon].onmessage = function(event) {
				if(event.data.y > (window.innerHeight + 110) || 
					document.getElementById("b" + event.data.b).style.backgroundImage.indexOf(POP_IMAGE) > -1) {
					this.terminate();
					workerStates[event.data.b] = 0;
					balloonSpeeds[event.data.b] = 0;
					if(event.data.y > (window.innerHeight + 110) && document.getElementById("time").innerHTML > 10 &&
					   document.getElementById("b" + event.data.b).style.backgroundImage.indexOf(POP_IMAGE) == -1 &&
					   document.getElementById("b" + event.data.b).style.backgroundImage.indexOf(DEATH_BALLOON) == -1 &&
					   document.getElementById("b" + event.data.b).style.backgroundImage.indexOf(MORE_TIME_BALLOON) == -1) {
					   document.getElementById("time").innerHTML = 
							document.getElementById("time").innerHTML - 10;
					   document.getElementById("time").style.color = "rgb(255,0,0)";
					}
				} else {
					document.getElementById("b" + event.data.b).style.bottom = event.data.y + "px";
					document.getElementById("b" + event.data.b).style.left = event.data.x + "px";
					document.getElementById("t" + event.data.b).style.bottom = (event.data.y - 98) + "px";
					document.getElementById("t" + event.data.b).style.left = (event.data.x + 23) + "px";
					var tail = ((event.data.y % 2) == 0) ? "1" : "0";
					document.getElementById("t" + event.data.b).style.backgroundImage = "url(res/tail" + tail + ".png)";
				}
			};	
		}
		balloon++;
		if(balloon > MAX_BALLOONS - 1) {
			balloon = 0;
		}
		
		if(document.getElementById("time").innerHTML == 0 && !gameover) {
			gameover = true;
			document.getElementById("gameover").style.visibility = "visible";
			var highscore = window.localStorage.getItem("highscore");
			var playername = window.localStorage.getItem("playername");
			if(highscore != undefined && highscore != null) {
				if((document.getElementById("score").innerHTML * 1) > highscore) {
					window.localStorage.setItem("highscore", document.getElementById("score").innerHTML);
				}
			} else {
				window.localStorage.setItem("highscore", document.getElementById("score").innerHTML);
			}
			
			if(playername != undefined && playername != null) {
				document.getElementById("playername").value = playername;
			}
			
			highscore = window.localStorage.getItem("highscore");
			document.getElementById("highscore").innerHTML = document.getElementById("score").innerHTML;
			
			if(document.getElementById("score").innerHTML * 1 > 0) {
				document.getElementById("enterplayername").className = "visible";
				document.getElementById("playernameinput").className = "visible";
				document.getElementById("submitscorebutton").className = "visible";
				document.getElementById("or").className = "visible";
			} else {
				document.getElementById("enterplayername").className = "invisible";
				document.getElementById("playernameinput").className = "invisible";
				document.getElementById("submitscorebutton").className = "invisible";
				document.getElementById("or").className = "invisible";
			}
			
			var i = 0;
			for(i = 0;i < MAX_BALLOONS;i++) {
				var y = 1 * (document.getElementById("b" + i).style.bottom.replace("px", ""));
				if(y > 0 && y < window.innerHeight) {
					break;
				}
			}
			
			document.getElementById("score-label").style.visibility = "hidden";
			document.getElementById("score").style.visibility = "hidden";
			document.getElementById("time-label").style.visibility = "hidden";
			document.getElementById("time").style.visibility = "hidden";
			document.getElementById("submitscore").style.visibility = "visible";
			document.getElementById("restart").style.visibility = "visible";
			
			if(i == MAX_BALLOONS) {
				window.clearInterval(interval);
			}
		} else {
			document.getElementById("time").innerHTML = 
			document.getElementById("time").innerHTML - 1;
			document.getElementById("time").style.color = "rgb(0,0,0)";
		}
		
	}, 1000);	
}

function submitScore() {
	$.ajax({
		url : "http://www.markuskarjalainen.com/rest/ptb/",
		data : {"apikey" : "fdfa5d3de392e6e57d8b783f37a5d3f5", "name" : document.getElementById("playername").value, "score" : document.getElementById("score").innerHTML},
		async : false,
		success : function(data) {
			var highscores = $.parseJSON(data);
			var rows = "";
			
			$("#highscores-table tbody").children().remove();
			
			for(var i = 0;i < highscores["data"].length;i++) {
				rows += "<tr><td class=\"left\">" + highscores["data"][i].name + "</td><td class=\"right\">" + highscores["data"][i].score + "</td></tr>";
			}

			$(rows).appendTo("#highscores-table tbody");
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alert("Score submission failed. Please check that your phone is connected to the network.");
	    }
	});
	window.localStorage.setItem("playername", document.getElementById("playername").value);
	document.getElementById("gameover").style.visibility = "hidden";
	document.getElementById("submitscore").style.visibility = "hidden";
	document.getElementById("restart").style.visibility = "hidden";
	document.getElementById("score-label").style.visibility = "hidden";
	document.getElementById("score").style.visibility = "hidden";
	document.getElementById("time-label").style.visibility = "hidden";
	document.getElementById("time").style.visibility = "hidden";
	document.getElementById("highscores").style.visibility = "visible";
	document.getElementById("highscores-restart").style.visibility = "visible";
	document.getElementById("enterplayername").className = "invisible";
	document.getElementById("playernameinput").className = "invisible";
	document.getElementById("submitscorebutton").className = "invisible";
	document.getElementById("or").className = "invisible";
}

function pop(id) {
	if(document.getElementById("time").innerHTML > 0) {
		var element = document.getElementById(id);
		element.onclick = function() {};
		element.ontouchstart = function() {};
		var index = id.replace("b","").trim();
		if(element.style.backgroundImage.indexOf(DEATH_BALLOON) > -1) {
			document.getElementById("time").innerHTML = 0;
		} else if(element.style.backgroundImage.indexOf(MORE_TIME_BALLOON) > -1) {
			document.getElementById("time").innerHTML = 
				(document.getElementById("time").innerHTML * 1) + 10;
		}
		var tail = document.getElementById("t" + index);
		playAudio(POP_AUDIO, true);
		element.style.width = "100px";
		element.style.backgroundImage = "url(" + POP_IMAGE + ")";
		tail.style.visibility = "hidden";
		var timeout = setTimeout(function() {
			element.style.visibility = "hidden";
			element.style.bottom = "-260px";
			element.style.visibility = "visible";
			tail.style.visibility = "visible";
			tail.style.bottom = "-360px";
			element.style.width = "50px";
		}, 300);
		element.onclick = function() { pop(this.id); };
		element.ontouchstart = function() { pop(this.id); };
		document.getElementById("score").innerHTML =
			(document.getElementById("score").innerHTML * 1 + points[id] * balloonSpeeds[index]);
	}
}

function playAudio(audioSource, audio) {
	if(audio) {
		document.getElementById("audioplayer").src = audioSource;
		var audio = document.getElementById("audioplayer");
		if(typeof device != "undefined") {
			if(device.platform == "Android") {
				audioSource = "/android_asset/www/" + audioSource;
			} else if(device.platform == "WinCE") {
				audioSource = "/app/www/" + audioSource;
			} 
			audio = new Media(audioSource, 
				function() { audio.release(); }
				, onAudioError);
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
