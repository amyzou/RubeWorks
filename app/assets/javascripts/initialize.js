function initGraphics( container_id ) {
	scene = new THREE.Scene();
	projector = new THREE.Projector();

	canvas_width = $(window).width();
	canvas_height = $('#'+ container_id).height();

	camera = new THREE.PerspectiveCamera( 40, canvas_width/canvas_height, 1, 10000 );
	camera.position.y = 500;

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
	renderer.setSize( canvas_width, canvas_height);

	plane = new THREE.Mesh( 
		new THREE.PlaneGeometry( VOXEL_SIZE * GRID_SIZE, VOXEL_SIZE * GRID_SIZE, GRID_SIZE, GRID_SIZE ), 
		new THREE.MeshBasicMaterial( { color: 0x2c364f, wireframe: true } ) 
	);
	plane.rotation.x = - Math.PI / 2;
	plane.matrixAutoUpdate = false;
	plane.updateMatrix();
	scene.add( plane );

	initGeometry();
	initLighting();

	//APPEND CANVAS
	container = document.getElementById( container_id );
	container.appendChild( renderer.domElement );

	//picking
	container.addEventListener( 'mousemove', onMouseMove , false );
	container.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp , false );
	window.addEventListener ('resize', resizeViewport, false);
}

function resizeViewport() {
	canvas_width = $(window).width();
	camera.aspect = canvas_width/canvas_height;
	camera.updateProjectionMatrix();
	renderer.setSize( canvas_width, canvas_height);
}

function initGeometry(){
	// objLoader = new THREE.OBJLoader();
	JSONLoader = new THREE.JSONLoader();

	// roll-over Mesh
	//rollOverGeo = new THREE.CubeGeometry( VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE );
	cubeGeo = new THREE.CubeGeometry( VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE );
	rollOverMaterial = new THREE.MeshLambertMaterial( { color: 0xfcd87f, ambient: 0xfcd87f, opacity: 0.5, transparent: true } );
	defaultMaterial = new THREE.MeshLambertMaterial( { color: 0xfcd87f, ambient: 0xfcd87f, shading: THREE.FlatShading });
	rollOverMesh = new THREE.Mesh(cubeGeo, rollOverMaterial);
	rollOverMesh.position = objectWorldPosition;
	scene.add(rollOverMesh);
}

function initLighting(){
	var ambientLight = new THREE.AmbientLight( 0x606060 );
	scene.add( ambientLight );
	var directionalLight = new THREE.DirectionalLight( 0xddddff );
	directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
	scene.add( directionalLight );
}

function loadObjects ( objects ) {
	NObjectsToLoad = objects.length;
	for (var i in objects) {
		var obj = objects[i];
		loadObject(obj);
	}
}

function loadObject( obj ) {
	objectMeshes[obj.id] = 
   	{ 
    	geometry : cubeGeo,
    	block_num: obj.block_num,
    	blocks: obj.blocks,
		category: obj.category,
		scale: new THREE.Vector3(1,1,1),
		dimensions: obj.dimensions,
		offsets: []
    };

    var offset =  new THREE.Vector3( obj.dimensions[0] - 1,  obj.dimensions[2] - 1, obj.dimensions[1] - 1);
	offset.multiplyScalar(VOXEL_SIZE * 0.5);

	objectMeshes[obj.id].offsets[0] = offset.clone();
	if (obj.block_num > 1) {
		objectMeshes[obj.id].offsets[1] = new THREE.Vector3( -offset.z, offset.y, offset.x );
	}

	if (obj.obj_file != "" ){
		JSONLoader.load( "obj/" + obj.obj_file, function(geometry, material) {
			loadJSONGeometry (obj.id, geometry,material) ;
			NObjectsToLoad--;
			if (NObjectsToLoad <= 0) startAnimation();
		} );		
		return;
	}

	NObjectsToLoad--;
	if (NObjectsToLoad <= 0) startAnimation();
}

function loadJSONGeometry( id, geo, mat) {
	THREE.GeometryUtils.center(geo);
    objectMeshes[id].geometry = geo;

	if (objectMeshes[id].category == 'gadget')   
	 	objectMeshes[id].scale.set( VOXEL_SIZE, VOXEL_SIZE * objectMeshes[id].dimensions[2]/(geo.boundingBox.max.y - geo.boundingBox.min.y), VOXEL_SIZE);
	else {
		objectMeshes[id].scale.set(
			objectMeshes[id].dimensions[0]/(geo.boundingBox.max.x - geo.boundingBox.min.x),
			objectMeshes[id].dimensions[2]/(geo.boundingBox.max.y - geo.boundingBox.min.y),
			objectMeshes[id].dimensions[1]/(geo.boundingBox.max.z - geo.boundingBox.min.z)
		);
		objectMeshes[id].scale.multiplyScalar(VOXEL_SIZE);
	}	
}


