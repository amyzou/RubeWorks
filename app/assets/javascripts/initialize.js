function initGraphics( container_id ) {
	scene = new THREE.Scene();
	projector = new THREE.Projector();

	canvas_width = $(window).width();
	canvas_height = $('#'+ container_id).height();

	camera = new THREE.PerspectiveCamera( 45, canvas_width/canvas_height, 1, 10000 );
	camera.position.y = 600;

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
	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xfcd87f, wireframe: true, opacity: 0.5, transparent: true } );
	rollOverErrorMaterial = new THREE.MeshBasicMaterial( { color: 0xb93131, wireframe: true, opacity: 0.5, transparent: true } );
	defaultMaterial = new THREE.MeshLambertMaterial( { color: 0x384463, ambient: 0x384463, shading: THREE.FlatShading });
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


