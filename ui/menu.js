(function() {

	var Menu = function() {

		var startElem = document.getElementsByClassName('start');
		var resetElem = document.getElementsByClassName('reset');
		var currentElem = document.getElementById('current');
		var instructElem = document.getElementsByClassName('instruct');


		// Start and Stop handler
		startElem[0].addEventListener('click', function() {
			if (!cycleControl.state.running) {
				cycleControl.start();
				startElem[0].innerHTML = "Stop";
			} else {
				cycleControl.stop();
				startElem[0].innerHTML = "Start";
			}
		}, false);

		// Reset handler
		resetElem[0].addEventListener('click', function() {
			if (!cycleControl.state.running) {
				State.destroyState();
				unpopulateWorld();
				translateState(State);
			}	
		}, false)

		// Intstructions handler
		instructElem[0].addEventListener('click', showInstructions, false);

		// current color choice callback
		this.setCurrentColor = function(color) {
			currentElem.style.backgroundImage = "none";
			var hashColor = color.replace("0x", "#")
			currentElem.style.backgroundColor = hashColor;
		}

		// displays delete icon - skull and cross bones
		this.showDeleteSign = function() {
			console.log("woof!");
			currentElem.style.backgroundColor = "black";
			currentElem.style.backgroundImage = "url('./public/images/icon_38485/icon_38485.png')";
			currentElem.style.backgroundSize = "60px 60px";
			currentElem.style.backgroundPosition = "center"; 
		}

	};

	window.menu = new Menu();

})();