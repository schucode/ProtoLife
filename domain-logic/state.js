//CRUD => CREATE/add, READ/retrieve/search/view, UPDATE/edit, DESTROY/deactivate

var State = {
	
	population : [],

	addBlock: function(rules, x, y, z, color) {
		var block = new Block();
		block.rules = rules;
		block.color = parseInt(color);
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
	}

}
