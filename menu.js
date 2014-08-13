var startElem = document.getElementsByClassName('start');

// Start and Stop
startElem[0].addEventListener('click', function() {
	if (!cycleControl.state.running) {
		cycleControl.start();
		startElem[0].innerHTML = "Stop";
	} else {
		cycleControl.stop();
		startElem[0].innerHTML = "Start";
	}
}, false);


var resetElem = document.getElementsByClassName('reset');

resetElem[0].addEventListener('click', function() {
	if (!cycleControl.state.running) {
		State.destroyState();
		unpopulateWorld();
		translateState(State);
	}	
}, false)