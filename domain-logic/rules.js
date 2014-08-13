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

// tested successful
// var r1 = [ 
// { 
// 	conditions:["state=0"], 
//  	outcomes:["moveNorth"]
// }
// ];


// var r2 = [
// { 
// 	conditions:["north/state=0"], 
//  	outcomes:["moveSouth"]
// }
// ];


// var r3 = [
// { 
// 	conditions:["north.north/state=0"], 
//  	outcomes:["moveEast"]
// }
// ];


// var r4 = [
// { 
// 	conditions:[">5/neighbors/state=0"], 
//  	outcomes:["moveWest"]
// }
// ];


// var r4 = [
// { 
// 	conditions:["<2/neighbors/state=0"], 
//  	outcomes:["moveUp"]
// }
// ];


// var r5 = [
// { 
// 	conditions:["state=0", "north/state=0", "north.north/state=0", "<2/neighbors/state=0"], 
//  	outcomes:["moveDown"]
// }
// ];