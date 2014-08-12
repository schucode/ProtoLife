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
		this.population.push(block);
	},

	retrieveBlockByPosition: function(x, y, z) {
		for (var i=0; i<this.population.length; i++) {
			var block = this.population[i];
			if (block.x == x && block.y == y && block.z == z) 
				return block; 
		}
	},

	updateBlock: function() {

	},

	deleteBlock: function() {

	},

	deleteAllBlocks: function() {

	}

}

