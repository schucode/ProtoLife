
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000); // original is 1000. how far the camera can see
	var renderer = new THREE.WebGLRenderer();

	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);

	camera.position.z = 100;
	camera.position.x = 100;
	camera.position.y = 100;

	var projector = new THREE.Projector();
	var mouseVector = new THREE.Vector3();
	var raycaster = projector.pickingRay( mouseVector.clone(), camera );

	var centerGeo = new THREE.SphereGeometry(5);
	var centerMaterial = new THREE.MeshBasicMaterial({color: 0xFF0000});
	var center = new THREE.Mesh(centerGeo, centerMaterial);
	center.position.y = -20;
	scene.add(center);

	var dir = new THREE.Vector3( 0, 0, 2 );
	var origin = new THREE.Vector3( 0, -20, 0 );
	var length = 50;
	var hex = 0xff0000;

	var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
	scene.add( arrowHelper );



	////////////////////////// WORLD CREATION //////////////////////////

	// CONSTANTS
	var scale = 50;  // height, width, and depth of grid cube
	var width = 40;	// width of grid in cubes
	var depth = 40;  // depth of grid in cubes

	var floorProperties = { color: 0xC0C0C0, 				// 
		                      side: THREE.DoubleSide}

	var localityProperties = { color: 0xFF0000, 			// red
														 wireframe: false,
														 visible: false}				

	// VARIABLES

	var openLocalities = [];				
	var localities = [];
	var thingsInTheWorld = [];

	// MAKE WORLD //

	var conjureGridFloor = function() {
	var gridXZ = new THREE.GridHelper(10000, scale);
	gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
	gridXZ.position.set( 0,-25,0 );
	scene.add(gridXZ);
	return gridXZ;
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

	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;

	var light1 = new THREE.SpotLight(0xffffff);
	light1.position.set(scale*10, scale*10, scale*10);
	//light1.shadowCameraVisible = true;
	light1.shadowDarkness = 0.95;
	light1.intensity = 3;
	light1.castShadow = true;
	scene.add(light1);

	var light2 = new THREE.SpotLight(0xffffff);
	light2.position.set(-20*scale, -40*scale, 75*scale);
	//light2.shadowCameraVisible = true;
	light2.shadowDarkness = 0.95;
	light2.intensity = .75;
	light2.castShadow = true;
	scene.add(light2);

	var light3 = new THREE.SpotLight(0xffffff);
	light3.position.set(0, 1000, 0);
	//light3.shadowCameraVisible = true;
	light3.shadowDarkness = 0.95;
	light3.intensity = 5;
	light3.castShadow = true;
	scene.add(light3);
	

	// Create the underlying, interactive grid
	var setUpGraphics = function() {
		scene.fog = new THREE.Fog( 0x000000, 2000, 5000);		
		var viewGrid = conjureGridFloor();									

		delineateGrid();

	}



	////////////////////////// WORLD CHANGES //////////////////////////

	var keyColors = {
		k1: "0x3FE12D",
		k2: "0xCD31AB",
		k3: "0xF02900",
		k4: "0x1B98DC",
		k5: "0xF99928"
	}

	var addBlockRequest = function( locality, key ) {
		var x = locality[0];
		var z = locality[1];
		var rules;
		var color;

		switch(key) {
			case 49: 								// numeral 1
				rules = RuleSets.r1; 	
				color = keyColors.k1;			// green
				break;
			case 50: 								// numeral 2
				rules = RuleSets.r2;						
				color = keyColors.k2;			// pink				
				break;
			case 51: 								// numeral 3
				rules = RuleSets.r3	
				color = keyColors.k3;			// red						
				break;
			case 52: 								// numeral 4
				 rules = RuleSets.r4;	
				 color = keyColors.k4;		// blue	
				break;
			case 53: 								// numeral 5
				 rules = RuleSets.r5;	
				 color = keyColors.k5;		// orange						
				break;
			default:
				console.log("no block type");
				return false;
				break;
		}
		if (!State.retrieveBlockByPosition(x, 0, z))	// does not allow the user to place multiple blocks in the same place
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
		easyPut: false,

		setKey: function(keyCode) {
			UX.key = keyCode;
			switch (this.key) {
				case 49: 
					menu.setCurrentColor(keyColors.k1);
					break;
				case 50:
					menu.setCurrentColor(keyColors.k2);	
					break;
				case 51:
					menu.setCurrentColor(keyColors.k3);
					break;
				case 52:
					menu.setCurrentColor(keyColors.k4);
					break; 
				case 53:
					menu.setCurrentColor(keyColors.k5);
					break;
				case 68:
					menu.showDeleteSign();
					break;
				default: 
					menu.setCurrentColor("#000000");
					break;
			}
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
				var locality = [intersects[0].object.block.x, intersects[0].object.block.z];
				deleteBlockRequest( locality, UX.key );
			}
		}
	}

	renderer.domElement.addEventListener( 'mousemove', function(e) {
		UX.helpSelect(e);
		if ( UX.easyPut ) {
			if ( UX.key != 68 ) // if the key is not the delete key, keycode = 68
				UX.clickGrid(e);	// make a clock
			else 								// if it is
				UX.clickBlocks(e)	// delete
		}
	}, false );

	renderer.domElement.addEventListener( 'click', UX.clickGrid, false );

	renderer.domElement.addEventListener( 'click', UX.clickBlocks, false );

	window.addEventListener( 'keydown', function(e) {
		if (e.keyCode != 83) // 's' is special; it is used for easy-placement
			UX.setKey(e.keyCode)
		else
			UX.easyPut = true;
	}, false );

	window.addEventListener( 'keyup', function(e) { 
		if (e.keyCode == 83) // 's' is special; it is used for easy-placement
			UX.easyPut = false;
	}, false );

		

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
										},
										color: function(mesh, value) {
											mesh.material.color.setHex( value );
										}
	}


	var createWorldBlock = function(block) {
		var geo = new THREE.BoxGeometry(scale, scale, scale);
		//var geo = new THREE.SphereGeometry(2.5);
		//var mat = new THREE.MeshLambertMaterial();
		var mat = new THREE.MeshPhongMaterial();  
		var mesh = new THREE.Mesh(geo, mat);
		//mesh.castShadow = true; 	// NEW
		//mesh.receiveShadow = true;		 //NEW
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

	var deleteWorldMemberByBlock = function ( block ) {
		for (var i in thingsInTheWorld) {
			if (thingsInTheWorld[i] == block.rep) {
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



