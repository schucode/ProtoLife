 (function() { 

  var Interpreter = function() {

		var block; 
		var rules; 

		this.setBlock = function(some_block) {
			block = some_block;
			rules = some_block.rules;
		}

		this.executeOutcome = function() {
			if (block.changeLog) {
		 		for (var i in block.changeLog) {
		 			var change = block.changeLog[i];
		 			if (block[change] instanceof Function) 
		 				performAction(change);					 // implement behavior
		 			else 
		 				updateIntrinsic(change);		// change property
				}
			}
			console.log(block);
		}

		var performAction = function(change) {
			block[change]();
		}

		var updateIntrinsic = function(change) {
			var property = getProperty(change);
			var value = getRequiredPropertyValue(change);
			block[property] = value;
		}

		this.logOutcome = function() {
			block.changeLog = getOutcome();
		}

		// return outcome of rule, an array.
		var getOutcome = function() {
			var rule = getRule();
			if (rule) return rule["outcomes"];
		}

		// returns a rule the conditions of which the block satisfies; undefined otherwise
		var getRule = function() {
			for (var i in rules)
				if (  satisfiedRule(rules[i]) ) return rules[i]
		}

		// returns true if the block satisfies every condition of the rule
		var satisfiedRule = function(rule) {
			var conditions = getConditionsArray(rule); 
			for (var i in conditions)
				if ( !satisfiedCondition(conditions[i]) ) return false
			return true;
		}

		// returns the conditions array of a rule object. Receives a rules array
		// receives a rule object   
		var getConditionsArray = function(rule) {
			return rule["conditions"];
		}

		// returns true if the block satisfies the property-value pair 
		// receives a string of form "target/poperty-value/optional quantifier"
		var satisfiedCondition = function(condition) {
			var target = getTarget(condition);
			if (target == undefined) return false;
			if (target instanceof Array) 
				return evaluateCollection(target, condition);
			else
				return evaluateBlock(target, condition);
		}

		// returns true if a block satisfies a condition
		var evaluateBlock = function(single_block, condition) {
			var property = getProperty(condition);
			var required_value = getRequiredPropertyValue(condition);
			if (single_block[property] instanceof Function) 
				return single_block[property]();
			else 
				return (single_block[property] == required_value)
		}

		// returns true if a collection satisfies a condition
		// receives array of form [block1, block2, block3, ... ] and condition string
		var evaluateCollection = function(collection, condition) {
			var property =  getProperty(condition);
			var required_value = getRequiredPropertyValue(condition);
			var required_quantity = getRequiredQuantity(condition); 
			var actual_quantity = getActualQuantity(collection, property, required_value);
			var comparison = getComparison(condition);

			return makeComparison(comparison, actual_quantity, required_quantity);
		}

		var makeComparison = function(comparison, actual_quantity, required_quantity) {
			switch(comparison) {
				case "=":
					return evaluateEqualWith(actual_quantity, required_quantity);
					break;
				case ">":
					return evaluateGreaterThan(actual_quantity, required_quantity);
					break;
				case "<":
					return evaluateLessThan(actual_quantity, required_quantity);
					break;
			}
		}

		var evaluateEqualWith = function(actual_quantity, required_quantity) {
			if (actual_quantity == required_quantity) 
				return true
			else
				return false
		}

		var evaluateGreaterThan = function(actual_quantity, required_quantity) {
			if (actual_quantity > required_quantity) 
				return true
			else
				return false
		}

		var evaluateLessThan = function(actual_quantity, required_quantity) {
			if (actual_quantity < required_quantity) 
				return true
			else
				return false
		}

		// returns the number of members of the collection that satisfy the property value
		var getActualQuantity = function(collection, property, value) {
			var counter = 0;
			for (var i in collection) {
				if ((collection[i]) && collection[i][property] == value) counter++;
			return counter;
			}
		}

		// returns a string "property" of "property=value"
		// receives a string of the form "quantifier/target/property=value"
		var getProperty = function(condition) {
			return parsePropertySring(condition)[0];
		}

		// returns a string "value" of "property=value"
		// receives a string of the form "quantifier/target/property=value"
		var getRequiredPropertyValue = function(condition) {
			return parsePropertySring(condition)[1];
		}

		// returns an array of form ["property", "value"]
		// receives a string of the form "quantifier/target/property=value"
		var parsePropertySring = function(condition) {
			var property_statement = getPropertyString(condition);
			return property_statement.split('=');
		}

		// returns the property string of the condition. 
		// receives a string of the form "quantifier/target/property=value"
		var getPropertyString = function(condition) {
			var size = condition.split('/').length;
			return condition.split('/')[size-1];
		}

		// returns the relation that is targeted; if no such object, the block is default
		// receives an array of relation keywords, like ["north", "south", "neighbors"]
		var getTarget = function(condition) {
			var relation_array = parseTargetString(condition);
			return getRelation(relation_array);
		}

		// returns an array of the relation keywords, like ["north", "south", "neighbors"]
		var parseTargetString = function(condition) {
			var string = getTargetString(condition);
			return string.split('.');
		}

		// returns the target string of the condition if one exists. 
		// receives a string of the form "quantifier/target/property-value"
		var getTargetString = function(condition) {
			var size = condition.split('/').length;
			if (condition.split('/')[size-2]) 
				return condition.split('/')[size-2];
			else
				return "";
		}

		// return final relation. 
		// Does not account for "neighbors.neighbors", i.e. collections of collections
		var getRelation = function(relation_array) {
			var pointer = block;
			if (relation_array[0] != "") {
				for (var i in relation_array) {
					var relation = relation_array[i];
					pointer = pointer[relation](); // may be undefined
					if (pointer == undefined) return undefined;
				}
			}
			return pointer;
		}

		// returns comparison operator in string form "<", ">", or "="
		var getComparison = function(condition) {
			 var quantifierString = getQuantifierString(condition);
			 return quantifierString[0];
		}

		// returns quantitiy in string form "1", "2, "3", etc.
		var getRequiredQuantity = function(condition) {
			var quantifierString = getQuantifierString(condition);
			return quantifierString[1];
		}

		// returns the quantifier string of the condition if one exists; of form "x<2"
		// receives a string of the form "quantifier/target/property-value"
		var getQuantifierString = function(condition) {
			var size = condition.split('/').length;
			if (condition.split('/')[size-3]) 
				return condition.split('/')[size-3];
		}

	}

	window.Interpret = new Interpreter();

})();


