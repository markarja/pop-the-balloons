var moveLeft = false;
var x = 250;
var y = -200;
var interval = setInterval(function () {
	if(moveLeft) {
		x--;
	} else {
		x++;
	}
	if(x == 300) {
		moveLeft = true;
	} else if(x == 250) {
		moveLeft = false;
	}
	y++;
	postMessage({"b" : "3", "x" : x, "y" : y});
}, 5);