(function() {

	var Menu = function() {

		var startElem = document.getElementsByClassName('start');
		var resetElem = document.getElementsByClassName('reset');
		var currentElem = document.getElementById('current');
		var instructElem = document.getElementsByClassName('instruct');
		var tableElems = document.getElementsByClassName('color-op');
		var ruleEditElem = document.getElementsByClassName('rule-edit');
		var conditionElem = document.getElementById('conditions');
		var outcomesElem = document.getElementById('outcomes');
		var ruleSubmit = document.getElementById('setRules');
		var doneButton = document.getElementById('done');
		var programColor = document.getElementById('colorprogram');
		var ruleDisplayAreaElem = document.getElementById('displayarea');
		var ruleDisplayElem = document.getElementById('displayRules');
		var clearRule = document.getElementById('clearRules');

		var rules;


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

		// click color div handler - keep green unaccessible 
		for (var i=1; i < tableElems.length; i++) {
			tableElems[i].addEventListener('click', function(e) {
				menuUI(this); // I think THIS
			}, false);
		}

		// done button event handler
		doneButton.addEventListener('click', function(e) {
			ruleEditElem[0].style.display = "none";
			ruleDisplayAreaElem.style.display = "none"
		}, false);

		// display rules and allow for editing
		var menuUI = function(elem) {
			var color = elem.className.split(" ")[1]; 

			displayColor(color);

			rules = getRulesForDiv(color);
			displayRules(rules);

			// rule submit click handler
			ruleSubmit.addEventListener('click', function(e) {
				addRulesForDiv(rules);
			}, false);

			clearRule.addEventListener('click', function(e) {
				rules.length = 0;
				displayRules(rules);
			})

			ruleEditElem[0].style.display = "inline";
		}

		var getRulesForDiv = function(color) {
			switch(color) {
				case "pink":
					return RuleSets.r2;
				break;
				case "red":
					return RuleSets.r3;
				break;
				case "blue":
					return RuleSets.r4;
				break;
				case "orange":
					return RuleSets.r5;
				break;
			}
		}

		var displayColor = function(color) {
			switch(color) {
				case "pink":
					programColor.style.backgroundColor = "#CD31AB";
				break;
				case "red":
					programColor.style.backgroundColor = "#F02900";
				break;
				case "blue":
					programColor.style.backgroundColor = "#1B98DC";
				break;
				case "orange":
					programColor.style.backgroundColor = "#F99928";
				break;
			}
		}

		var displayRules = function(rules) {
			ruleDisplayAreaElem.style.display = "inline";
			ruleDisplayElem.innerHTML = "";	// clear out before every render; simplifies things
			for (var i in rules) { // loop through rule objects
				var rule = rules[i];
				var cond = rule.conditions;
				var out = rule.outcomes;

				ruleDisplayElem.innerHTML += "<span>(" + i + ")</span>"
				ruleDisplayElem.innerHTML += "<span> conditions: " + cond + "</span><br/>";
				ruleDisplayElem.innerHTML += "<span> &nbsp;&nbsp;&nbsp; outcomes: " + out + "</span><br/><br/>";
			}

		}

		var addRulesForDiv = function(rules) {
			var userConditions = conditionElem.value;
			var userOutcomes = outcomesElem.value;
			// put userConditions into array form
			var parsedConditions = userConditions.split(" ");
			var parsedOutcomes = userOutcomes.split(" ");
			var newRule = {};
			newRule["conditions"] = parsedConditions;
			newRule["outcomes"] = parsedOutcomes;
			console.log(parsedOutcomes, parsedConditions);
			if (parsedOutcomes[0] != "" && parsedConditions[0] != "") { 
				rules.push(newRule);
				displayRules(rules);
				conditionElem.value="";
				outcomesElem.value="";
			}
		}

	};

	window.menu = new Menu();

})();