var Interpreter = {



	var block; // with rules
	var rules; // array of objects with conditions and outcomes

	var getTarget = function() {

	}

	var getRequiredValue = function() {

	}

	var getActualValue = function() {

	}

	var satisfiedCondition = function(n) {

	}

	// returns the conditions array of a rule object
	var getConditions = function(rule) {
		return rule["conditions"];
	}

	// returns true if the block satisfies rule n
	var satisfiedRule = function(n) {
		var rule = rules[n];
		var conditions = getConditions(rule);
		for (var i in conditions)
			if ( !conditionSatisfied(conditions[1]) ) return false
		return true;
	}

	// return applicable rule
	var getRule = function() {
		for (var i in rules)
			if (  satisfiedRule(i) ) return rules[i]
		return undefined;
	}

	// return outcome of rule, an array.
	var getOutcome = function() {
		var rule = getRule();
		if (rule) return rule["outcomes"];
	}

	// 
	var logOutcome = function() {
		return getOutcome();
	}

	var getRules = function(block) {
		var rules = block.rules;
	}

	var setBlock = function(myblock) {
		var block = block;
	}

}