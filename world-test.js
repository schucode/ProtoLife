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


//scene.fog = new THREE.FogExp2( 0x000000, .0025);


renderer.shadowMapEnabled = true;
// to antialias the shadow
// renderer.shadowMapSoft = true;

// var light = new THREE.SpotLight(0xffffff);
// light.castShadow = true;
// light.shadowDarkness = 0.5; // It is the opacity of the shadow. 0 means no shadow, 1 means pure back shadow.
// light.shadowCameraVisible = true;

//scene.add(light);

// spotlight #1 -- yellow, dark shadow
var placeSpotLight = function(x, y, z) {
	var spotlight = new THREE.SpotLight(0xffffff);
	spotlight.position.set(x, y, z);
	spotlight.shadowCameraVisible = true;
	spotlight.shadowDarkness = 0.95;
	spotlight.intensity = 2;
	// must enable shadow casting ability for the light
	spotlight.castShadow = true;

	// var lightTarget = new THREE.Object3D();
	// lightTarget.position.set(x,0,z);
	// scene.add(lightTarget);
	// spotlight.target = lightTarget;

	scene.add(spotlight);
}
	
placeSpotLight(300, 300, 300);
placeSpotLight(0, 500, -100);


////////////////////////// WORLD CREATION //////////////////////////

// CONSTANTS
var scale = 10;  // height, width, and depth of grid cube
var width = 40;	// width of grid in cubes
var depth = 40;  // depth of grid in cubes

var floorProperties = { color: 0xC0C0C0, 				// pink 
	                      side: THREE.DoubleSide}

var localityProperties = { color: 0xFF0000, 			// gray 
													 wireframe: false,
													 visible: true}				// will be false after testing

// VARIABLES

var openLocalities = [];				
var localities = [];
var thingsInTheWorld = [];

// MAKE WORLD //

// Defines and adds opaque floor 
var conjureFloor = function() {
	var geometry = new THREE.PlaneGeometry( 100, 100 );
	var material = new THREE.MeshLambertMaterial( floorProperties ); 
	var floor = new THREE.Mesh( geometry, material );
	//floor.castShadow = true;
	floor.receiveShadow = true;																// SHADOW STUFF
	floor.position.y = -5;
	floor.rotation.x = -Math.PI / 2;
	scene.add(floor);
}

var conjureFloor2 = function() {
	var gridXZ = new THREE.GridHelper(1000, 10);
	gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	gridXZ.position.set( 0,0,0 );
	scene.add(gridXZ);
}

// Defines and returns the cubic spaces that populate the interactive grid
var createLocality = function(x,z) {
	//var geometry = new THREE.BoxGeometry( scale, scale, scale );
	var geometry = new THREE.PlaneGeometry(scale, scale);
	var material = new THREE.MeshBasicMaterial( localityProperties );
	var locality = new THREE.Mesh( geometry, material );
	locality.name = [x,z];
	// the first term enqures that there is no space inbetween blocks.
	// the second term centers the grid 
	locality.rotation.x = -Math.PI / 2;	
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
	conjureFloor2();
	delineateGrid();
}



////////////////////////// WORLD CHANGES //////////////////////////


var addBlockRequest = function( locality, key ) {
	var x = locality[0];
	var z = locality[1];
	var rules;
	var color;

	switch(key) {
		case 49: 								// numeral 1
			rules = []; 					// dumb block
			color = "0x000000";		// black
			break;
		case 50: 								// numeral 2
			rules = Rules.fun;						// walk forward
			color = "0x00AA00";		// dark green				
			break;
		// case 51: 								// numeral 3
		// 	rules = r3;	// undefined
		// 	color = "0x006600";	// less dark green						
		// 	break;
		// case 52: 								// numeral 4
		// 	 rules = r3;	// undefined
		// 	 color = "0x009900";	// etc.		
		// 	break;
		// case 53: 								// numeral 5
		// 	// rules = someRules;	// undefined
		// 	 color = "0x00CC00";							
		// 	break;
		// case 54: 								// numeral 6
		// 	// rules = someRules;	// undefined
		// 	 color = "0x00ff00";							
		// 	break;
		default:
			console.log("no block type");
			return false;
			break;
	}
	State.addBlock(rules, x, 0, z, color);
	translateState(State);
}

var deleteBlockRequest = function( locality, key  ) {
	if (key == 68) {
		var x = locality[0];
		var z = locality[1];
		State.deleteBlockByPosition( x, 0, z );
		deleteWorldMember( locality );
		translateState(State);
	}
}



////////////////////////// WORLD INPUT //////////////////////////


var UX = {

	key: undefined,

	setKey: function(keyCode) {
		UX.key = keyCode;
	},

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
			addBlockRequest( locality, UX.key );
		}
	},

	clickBlocks: function(e) {
		var raycaster = UX.preface(e);
		intersects = raycaster.intersectObjects( thingsInTheWorld );
		if (intersects.length > 0) {
			//var locality = intersects[0].object.name; // name is position
			var locality = [intersects[0].object.block.x, intersects[0].object.block.z];
			deleteBlockRequest( locality, UX.key );
		}
	}

}

window.addEventListener( 'mousemove', UX.helpSelect, false );

window.addEventListener( 'click', UX.clickGrid, false );

window.addEventListener( 'click', UX.clickBlocks, false );

window.addEventListener( 'keydown', function(e) {UX.setKey(e.keyCode)}, false );

window.addEventListener( 'keyup',  UX.setKey(undefined), false);




////////////////////////// STATE TRANSLATION //////////////////////////

// Translation of State language into Mesh Lanuage

var ConvertToMesh = { 
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
										// add a bit to y to get the block on top of the grid
										mesh.position.y += scale/2;
									},
									color: function(mesh, value) {
										mesh.material.color.setHex( value );
									}
}


var createWorldBlock = function(block) {
	var geo = new THREE.BoxGeometry(scale, scale, scale);
	var mat = new THREE.MeshLambertMaterial();
	//var mat = new THREE.MeshBasicMaterial();  
	var mesh = new THREE.Mesh(geo, mat);
	mesh.castShadow = true; 										// SHADOW STUFF
	block.rep = mesh;
	mesh.block = block;
	thingsInTheWorld.push(block.rep);
	scene.add(mesh);
}

var updateWorldBlock = function(block) {
	for (var property in block) {
		var value = block[property];
		if (ConvertToMesh[property] != undefined) {
			ConvertToMesh[property](block.rep, value);
		}
	}
}

// Updates mesh properties according to block rules
var translateBlock = function(block) {
	if (block.rep == undefined) {
		createWorldBlock(block);
	}
	updateWorldBlock(block);
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
		if (thingsInTheWorld[i].block.x === locality[0]
			  && thingsInTheWorld[i].block.z === locality[1]) {
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


setUpGraphics();

render();