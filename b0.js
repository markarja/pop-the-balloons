var moveLeft = false;
var x = 1;
var y = -200;
var interval = setInterval(function () {
	if(moveLeft) {
		x--;
	} else {
		x++;
	}
	if(x == 20) {
		moveLeft = true;
	} else if(x == 1) {
		moveLeft = false;
	}
	y++;
	postMessage({"b" : "0", "x" : x, "y" : y});
}, 10);