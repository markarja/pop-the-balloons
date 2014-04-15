var x = 0;
var interval = setInterval(
function() {
	postMessage(x);
	x++;
}, 20);