// Business Logic Testing

console.log("go testing");

var test_rules = [
{ 
	conditions:["state=0", "north/state=0", "north.north/state=0", "<2/neighbors/state=0"], 
 	outcomes:["moveForward"]
}
];

// successfully tested individually
var r1 = [ 
{ 
	conditions:["state=0"], 
 	outcomes:["moveForward"]
}
];

// successfully tested individually
var r2 = [
{ 
	conditions:["north/state=0"], 
 	outcomes:["moveBackward"]
}
];

// successfully tested individually
var r3 = [
{ 
	conditions:["north.north/state=0"], 
 	outcomes:["moveSidward"]
}
];

// successfully tested individually
var r4 = [
{ 
	conditions:[">5/neighbors/state=0"], 
 	outcomes:["moveUpward"]
}
];

// successfully tested individually
var r4 = [
{ 
	conditions:["<2/neighbors/state=0"], 
 	outcomes:["moveUpward"]
}
];

// successfully tested individually
var r5 = [
{ 
	conditions:["state=0", "north/state=0", "north.north/state=0", "<2/neighbors/state=0"], 
 	outcomes:["moveDownward"]
}
];


/* 
		(1, 1, 3)
    (1, 1, 2)
z   (1, 1, 1)(2, 1, 1)
    (1, 1, 0)

				x
*/


var test_rules = r5;

State.addBlock(test_rules, 1, 1, 1);
State.addBlock(test_rules, 1, 1, 2);
State.addBlock(test_rules, 1, 1, 3);
State.addBlock(test_rules, 2, 1, 1);
State.addBlock(test_rules, 1, 1, 0);

console.log(State.population);

var b = State.population[0];

console.log(b.x, b.y, b.z);

console.log( b.north() );

Interpret.setBlock(b);

Interpret.logOutcome();

// expect a rule
console.log(b.changeLog);

