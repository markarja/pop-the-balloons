var moveLeft = false;
var x = 100;
var y = -200;
var interval = setInterval(function () {
	if(moveLeft) {
		x--;
	} else {
		x++;
	}
	if(x == 200) {
		moveLeft = true;
	} else if(x == 100) {
		moveLeft = false;
	}
	y++;
	postMessage({"b" : "2", "x" : x, "y" : y});
}, 5);