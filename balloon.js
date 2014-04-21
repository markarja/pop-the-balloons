onmessage = function(event) {
	var moveLeft = false;
	var x = event.data.x;
	var y = -200;
	var interval = setInterval(function () {
		if(moveLeft) {
			x--;
		} else {
			x = x + (event.data.maxspeed - event.data.speed);
		}
		if(x >= event.data.limit) {
			moveLeft = true;
		} else if(x <= event.data.x) {
			moveLeft = false;
		}
		y = y + (event.data.maxspeed - event.data.speed);
		postMessage({"b" : event.data.b, "x" : x, "y" : y});
	}, event.data.speed);
}
