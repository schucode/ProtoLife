/*

All rules of form 
{ 
	conditions:["quantifier/target/property=value"], 
 	outcomes:["action"]
}

	CONDITIONS: 

	e.g. "<3/north.neighbors/color=blue"
			 read as: "There are less than 3 members of the north block's neighbors 
			 that have the color blue"

	1. There must be a "property=value" string

	2. The "target" and "quantifier" strings are optional
			(a) if no target is provided, the block reading the rules is the default target
			(b) a quantifier is only provided only if the target is a collection; when
			    the target is a collection, there must be a quantifier.
	3. The target is always either a block or an array of blocks

	4. There are three quantifiers; let n be a number between 1 and 10:
			(a) "=n" -> exactly n members of the collection
			(b) ">n" -> more than n members of the collection
			(c) "<n" -> less than n members of the collection

	OUTCOMES: 
*/

// var test_rules = [
// { 
// 	conditions:["state=0", "north.north/state=0", "<2/neighbors/state=2"], 
//  	outcomes:["moveForward"]
// }

// RULES //

/*
satisfied and unsatisfied
*/



// tested

var Test = function() {

	// INTRINSIC RULES

	//tested
	this.r1 = [ 
	{ 
		conditions:["state=0"], 
	 	outcomes:["moveNorth"]
	}
	];

	// tested
	this.r2 = [
	{ 
		conditions:["state=0"], 
	 	outcomes:["state=1"]
	}
	];

	// tested
	this.r3 = [
	{ 
		conditions:["state=1"], 
	 	outcomes:["state=2"]
	}
	];

	// tested
	this.r4 = [
	{ 
		conditions:["state=0"], 
	 	outcomes:["moveNorth", "moveNorth"]
	}
	];

	// tested
	this.r5 = [
	{ 
		conditions:["state=0"], 
	 	outcomes:["moveNorth", "moveUp"]
	}
	];

	// tested
	this.r6 = [
	{ 
		conditions:["state=0"], 
	 	outcomes:["state=1"]
	}, 
	{ 
		conditions:["state=1"], 
	 	outcomes:["state=2"]
	},
	{ 
		conditions:["state=2"], 
	 	outcomes:["moveUp"]
	},
	];	

	// RELATION RULES

	// tested
	this.r7 = [
	{ 
		conditions:["state=0", "seeNorth"], 
	 	outcomes:["moveUp"]
	}
	];

	this.r8 = [
	{ 
		conditions:["seeSouth"], 
	 	outcomes:["moveUp"]
	}
	];

	this.r9 = [
	{ 
		conditions:["seeSouth"], 
	 	outcomes:["state=2", "moveEast"]
	}
	];

	this.r10 = [
	{ 
		conditions:["north/state=0"], 
	 	outcomes:["moveEast"]
	}
	];

	this.r11 = [
	{ 
		conditions:["north/state=0"], 
	 	outcomes:["moveEast"]
	}
	];

	this.r12 = [
	{ 
		conditions:["north.east/state=0"], 
	 	outcomes:["moveEast"]
	}
	];

	this.r13 = [
	{ 
		conditions:["north.north.west/state=0"], 
	 	outcomes:["moveEast"]
	}
	];

	this.r14 = [
	{ 
		conditions:["north.north.west/state=0", "seeSouth"], 
	 	outcomes:["moveUp"]
	}
	];

	// MAKE BOXES TEST

	this.r15 = [
	{ 
		conditions:["state=0"], 
	 	outcomes:["makeBlock", "moveWest"]
	}
	];

	this.r16 = [
	{ 
		conditions:["state=0"], 
	 	outcomes:["makeBlock", "moveUp"]
	}
	];

	this.r16 = [
	{ 
		conditions:["state=0", "seeSouth=true"], 
	 	outcomes:["moveSouth"]
	},
	{ 
		conditions:["state=0", "seeSouth=false"], 
	 	outcomes:["moveSouth"]
	}
	];

	// this.r5 = [
	// { 
	// 	conditions:["state=0", "north/state=0", "north.north/state=0", "<2/neighbors/state=0"], 
	//  	outcomes:["moveDown"]
	// }
	// ];
}

var test = new Test(); 