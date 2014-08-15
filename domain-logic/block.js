var Block = function() {
	this.changeLog;
	this.rules;
	this.color; // intended to correspond with rules; see world.js line 92+
	// INTRINSIC PROPERTIES
	this.x; 	// EAST +x, WEST -x
	this.y;		// UP +y, DOWN -y
	this.z;  	// NORTH +z, SOUTH -z
	this.state = 0;

	// RELATIONS
	this.north = function() {
		return State.retrieveBlockByPosition(this.x, this.y, this.z+1);
	};
	this.south = function() {
		return State.retrieveBlockByPosition(this.x, this.y, this.z-1);
	};
	this.east = function() {
		return State.retrieveBlockByPosition(this.x+1, this.y, this.z);
	};
	this.west = function() {
		return State.retrieveBlockByPosition(this.x-1, this.y, this.z);
	};
	this.northwest = function() {
		return State.retrieveBlockByPosition(this.x-1, this.y, this.z+1);
	};
	this.southwest = function() {
		return State.retrieveBlockByPosition(this.x+1, this.y, this.z-1);
	};
	this.northeast = function() {
		return State.retrieveBlockByPosition(this.x+1, this.y, this.z+1);
	};
	this.southeast = function() {
		return State.retrieveBlockByPosition(this.x+1, this.y, this.z-1);
	};
	this.above = function() {
		return State.retrieveBlockByPosition(this.x, this.y+1, this.z);
	};
	this.below = function() {
		return State.retrieveBlockByPosition(this.x, this.y-1, this.z);
	};
	this.neighbors = function() {
		return [this.north(), 
						this.south(), 
						this.east(),
		        this.west(), 
		        this.northwest(), 
		        this.southwest(),
		        this.northeast(), 
		        this.southeast()];
	};

	// RELATIONAL PROPERTIES
	this.seeNorth = function() {
		if ( this.north() ) return true;
		return false;
	};
	this.seeSouth = function() {
		if ( this.south() ) return true;
		return false;
	};
	this.seeEast = function() {
		if ( this.east() ) return true;
		return false;
	};
	this.seeWest = function() {
		if ( this.west() ) return true;
		return false;
	};
	this.seeAbove= function() {
		if ( this.above() ) return true;
		return false;
	};
	this.seeBelow = function() {
		if ( this.below() ) return true;
		return false;
	};


	// ACTIONS ON INTRINSICS
	this.moveNorth = function() {
		this.z += 1;
	};
	this.moveSouth = function() {
		this.z -=1;
	};
	this.moveEast = function() {
		this.x +=1;
	};
	this.moveWest = function() {
		this.x -=1;
	};
	this.moveUp = function() {
		this.y +=1;
	};
	this.moveDown = function() {
		this.y -=1;
	};

	// ACTIONS on ENVIRONMENT

	this.makeBlock = function() {
		State.addBlock([], this.x, this.y, this.z, "0x3FE12D");
	};

	this.makeRed = function() {
		State.addBlock(RuleSets.r3, this.x, this.y, this.z, keyColors.k3);
	};

};
