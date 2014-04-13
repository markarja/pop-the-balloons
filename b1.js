var moveLeft = false;
var x = 20;
var y = -200;
var interval = setInterval(function () {
	if(moveLeft) {
		x--;
	} else {
		x++;
	}
	if(x == 40) {
		moveLeft = true;
	} else if(x == 20) {
		moveLeft = false;
	}
	y++;
	postMessage({"b" : "1", "x" : x, "y" : y});
}, 10);