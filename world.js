var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000); // original is 1000. how far the camera can see
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.z = 45;
camera.position.x = 45;
camera.position.y = 15;

var projector = new THREE.Projector();
var mouseVector = new THREE.Vector3();
var raycaster = projector.pickingRay( mouseVector.clone(), camera );

var centerGeo = new THREE.SphereGeometry(1);
var centerMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
var center = new THREE.Mesh(centerGeo, centerMaterial);
scene.add(center);



////////////////////////// WORLD CREATION //////////////////////////

// CONSTANTS
var scale = 5;  // height, width, and depth of grid cube
var width = 40;	// width of grid in cubes
var depth = 40;  // depth of grid in cubes

var floorProperties = { color: 0xC0C0C0, 				// pink 
	                      side: THREE.DoubleSide}

var localityProperties = { color: 0xFF0000, 			// gray 
													 wireframe: false,
													 visible: false}				// will be false after testing

// VARIABLES

var openLocalities = [];				// may not need
var localities = [];
var thingsInTheWorld = [];

// MAKE WORLD //

// Defines and adds opaque floor 
var conjureFloor = function() {
	var geometry = new THREE.PlaneGeometry( width*scale, depth*scale );
	var material = new THREE.MeshBasicMaterial( floorProperties ); 
	var floor = new THREE.Mesh( geometry, material );
	floor.position.y = -5;
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);
}

// Defines and returns the cubic spaces that populate the interactive grid
var createLocality = function(x,z) {
	//var geometry = new THREE.BoxGeometry( scale, scale, scale );
	var geometry = new THREE.BoxGeometry(scale, scale, scale);
	var material = new THREE.MeshBasicMaterial( localityProperties );
	var locality = new THREE.Mesh( geometry, material );
	locality.name = [x,z];
	// the first term enqures that there is no space inbetween blocks.
	// the second term centers the grid 
	locality.position.x = x*scale - (((width-1)/2)*scale);
	locality.position.z = z*scale - (((depth-1)/2)*scale);
	return locality
}

// Defines and adds the interactive grid.
var delineateGrid = function() {
	for (var i=0; i<width; i++) {
		for (var j=0; j<depth; j++) {
			var locality = createLocality(i, j);
			openLocalities.push(locality);				// may not need
			localities.push(locality);	
			scene.add(locality);
		}
	}
} 

// Create the underlying, interactive grid
var setUpGraphics = function() {
	conjureFloor();
	delineateGrid();
}

////////////////////////// WORLD CHANGES //////////////////////////


var addBlockRequest = function( locality, key ) {
	var x = locality[0];
	var z = locality[1];
	var DNA;
	var rules;
	var color;

	switch(key) {
		case 49: // numeral 1
			rules = []; // dumb block
			color = "0x000000";
			State.addBlock(rules, color, x, 0, z);
			break;
		case 50: // numeral 2
			rules = someRules;	
			color = "0x00ff00";							
			State.addBlock(rules, color, x, 0, z);
			break;
		default:
			console.log("no block type");
			return false;
			break;
	}
	translateState(State);
}

var deleteBlockRequest = function( locality, key  ) {
	if (key == 68) {
		deleteBlock( locality );
		deleteWorldMember( locality );
		translateState(State);
	}
}


////////////////////////// WORLD INPUT //////////////////////////


var UX = {

	// For eliminating redundant code in Ux methods
	preface: function(e) {
		mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
		mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight);
		var raycaster = projector.pickingRay( mouseVector.clone(), camera );
		return raycaster;
	}, 

	// Make cubic spaces light up when hovering
	helpSelect: function(e) {							
		var raycaster = UX.preface(e);
		intersects = raycaster.intersectObjects( localities );
		for (var i=0; i<openLocalities.length; i++) {
				openLocalities[i].material.visible = false;  
		}
		if (intersects.length > 0) {
			intersects[0].object.material.visible = true;
		}
	}, 

	// Handle click events
	clickGrid: function(e) {
		var raycaster = UX.preface(e);
		intersects = raycaster.intersectObjects( localities );
		if (intersects.length > 0) {
			var locality = intersects[0].object.name; // name is position
			addBlockRequest( locality, key );
		}
	},

	clickBlocks: function(e) {
		var raycaster = UX.preface(e);
		intersects = raycaster.intersectObjects( thingsInTheWorld );
		if (intersects.length > 0) {
			var locality = intersects[0].object.name; // name is position
			deleteBlockRequest( locality, key );
		}
	}

}

var key;

window.addEventListener( 'mousemove', UX.helpSelect, false );
window.addEventListener( 'click', UX.clickGrid, false );
window.addEventListener( 'click', UX.clickBlocks, false );
window.addEventListener( 'keydown', function(e) {
	key = e.keyCode;
}, false);
window.addEventListener( 'keyup', function(e) {
	key = undefined;
}, false);

////////////////////////// STATE TRANSLATION //////////////////////////

// Translation of State language into Mesh Lanuage

var ConvertDNAtoMesh = { 
									alive: function(mesh, value) {
										if (value ){ // if living 
											mesh.material.visible = true;
											//mesh.material.color.setHex( 0xFF0000 ); // red
										} else {  // if dead
											mesh.material.visible = false;
											//mesh.material.color.setHex( 0x00FF00 ); // green
										}
									},
									x: function(mesh, value) {
										var convert = value*scale - (((width-1)/2)*scale);
										mesh.position.x = convert;
									},
									z: function(mesh, value) {
										var convert = value*scale - (((depth-1)/2)*scale);
										mesh.position.z = convert;
									},
									y: function(mesh, value) {
										var convert = value*scale;
										mesh.position.y = convert;
									},
									color: function(mesh, value) {
										console.log("ugh?");
										mesh.material.color.setHex( value );
									}
}


var createWorldBlock = function(block) {
	var geo = new THREE.BoxGeometry(scale, scale, scale);
	var mat = new THREE.MeshBasicMaterial();  
	var mesh = new THREE.Mesh(geo, mat);
	block.rep = mesh;
	mesh.block = block;
	thingsInTheWorld.push(block.rep);
	scene.add(mesh);
}

var changeWorldBlock = function(block) {
	for (var property in block) {
		var value = block[property];
		if (ConvertDNAtoMesh[property] != undefined) {
			ConvertDNAtoMesh[property](block.rep, value);
		}
	}
}

// Updates mesh properties according to block rules
var translateBlock = function(block) {
	if (block.rep == undefined) {
		createWorldBlock(block);
	}
	changeWorldBlock(block);
}

// Updates graphical representation according to the state description
var translateState = function(State) {
	for (var i=0; i<State.population.length; i++) {
		translateBlock(State.population[i]);
	}
}

var unpopulateWorld = function() {
	for (var i=0; i < thingsInTheWorld.length; i++) {
		scene.remove(thingsInTheWorld[i]);
	}
	thingsInTheWorld = [];
}

var deleteWorldMember = function( locality ) {
	var thingsLocal;
	for (var i=0; i < thingsInTheWorld.length; i++) {
		if (thingsInTheWorld[i].name == locality) {
			thingsLocal = i;
			scene.remove(thingsInTheWorld[i]);
			break;
		}
	}
	thingsInTheWorld.splice(thingsLocal, 1);
}

/////// END REFACTOR  /////// END REFACTOR  /////// END REFACTOR  /////// END REFACTOR  /////// END REFACTOR  /////// END REFACTOR 
 
render = function () {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	controls.update();
};


//setUpGraphics();

//render();