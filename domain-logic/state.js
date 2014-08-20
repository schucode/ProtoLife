
var State = {
	
	population : [],

	addBlock: function(rules, x, y, z, color) {
		var block = new Block();
		block.rules = rules;
		//block.color = parseInt(color); // doesn't work on 0x009900 e.g. 
		block.color = color;
		block.x = x;
		block.y = y;
		block.z = z;
		State.population.push(block);
	},

	retrieveBlockByPosition: function(x, y, z) {
		for (var i in State.population) {
			var block = State.population[i];
			if (block.x == x && block.y == y && block.z == z) 
				return block; 
		}
	},

	deleteBlockByPosition: function(x, y, z) {
		var loc;
		for (var i in State.population) {
			var block = State.population[i];
			if (block.x == x && block.y == y && block.z == z) {
				loc = i;
				break;
			}
		}
		State.population.splice(loc, 1);
	},

	updateState: function() {
		for (var i in State.population) {
			var block = State.population[i];
			Interpret.setBlock(block);
			Interpret.logOutcome();
		};
		for (var i in State.population) {
			var block = State.population[i];
			Interpret.setBlock(block);
			Interpret.executeOutcome();
		}
	},

	destroyState: function() {
		State.population = [];
	},

	garbageControl: function() {

		for (var i in State.population) {
			var block = State.population[i];
			if (	 block.x > 200 
					|| block.x < -200
					|| block.y > 200
					|| block.y < -200
					|| block.z > 200
					|| block.z < -200) {
				State.deleteBlockByPosition(block.x, block.y, block.z);
				deleteWorldMemberByBlock(block);
			}
		}
	}

}

