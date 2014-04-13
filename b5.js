var moveLeft = false;
var x = 0;
var y = -200;
var interval = setInterval(function () {
	if(moveLeft) {
		x--;
	} else {
		x = x + 2;
	}
	if(x == 500) {
		moveLeft = true;
	} else if(x == 0) {
		moveLeft = false;
	}
	y++;
	postMessage({"b" : "5", "x" : x, "y" : y});
}, 10);