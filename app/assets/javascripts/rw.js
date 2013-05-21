function initGraphics() {
	scene = new THREE.Scene();
	projector = new THREE.Projector();

	canvas_width = $('#grid_container').width();
	canvas_height = $('#grid_container').height();

	camera = new THREE.PerspectiveCamera( 45, canvas_width/canvas_height, 1, 10000 );
	camera.position.y = 500;

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
	renderer.setSize( canvas_width, canvas_height);

	plane = new THREE.Mesh( 
		new THREE.PlaneGeometry( VOXEL_SIZE * GRID_SIZE, VOXEL_SIZE * GRID_SIZE, GRID_SIZE, GRID_SIZE ), 
		new THREE.MeshBasicMaterial( { color: 0x2c364f, wireframe: true } ) 
	);
	plane.rotation.x = - Math.PI / 2;
	scene.add( plane );

	initGeometry();
	initLighting();

	//APPEND CANVAS
	container = document.getElementById( 'grid_container' );
	container.appendChild( renderer.domElement );

	// picking
	mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
	container.addEventListener( 'mousemove', onDocumentMouseMove, false );
	container.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'keydown', onDocumentKeyDown, true );
	document.addEventListener( 'keyup', onDocumentKeyUp, true );
	//window.addEventListener ('resize', onWindowResize, false);
}

// function onWindowResize() {
// 	canvas_width = window.innerWidth;
// 	canvas_height = canvas_width * 0.75;
// 	renderer.setSize( canvas_width, canvas_height );
// }

function initGeometry(){
	// roll-over helpers
	rollOverGeo = new THREE.CubeGeometry( VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE );
	rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true, opacity: 0.5, transparent: true } );
	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	scene.add( rollOverMesh );
	// cubes

	cubeGeo = new THREE.CubeGeometry( VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE );
	cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, ambient: 0xfeb74c, shading: THREE.FlatShading } );
	cubeMaterial.ambient = cubeMaterial.color;

		//texture 

	var loader = new THREE.ImageLoader();
	loader.addEventListener( 'load', function (event) {
		var texture = new THREE.Texture();
		texture.image = e.content;
		texture.needsUpdate = true;

	});

	objLoader = new THREE.OBJLoader();

}

function initLighting(){
	var ambientLight = new THREE.AmbientLight( 0x606060 );
	scene.add( ambientLight );
	var directionalLight = new THREE.DirectionalLight( 0xddddff );
	directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
	scene.add( directionalLight );
}

function getRealIntersector( intersects ) {
	for( i = 0; i < intersects.length; i++ ) {
		intersector = intersects[ i ];
		if ( intersector.object != rollOverMesh ) {
			return intersector;
		}
	}
	return null;
}

//TODO: REMOVE
function changeObjSize() {
	var x = $('input[name="width"]').val();
	var y = $('input[name="length"]').val();
	var z = $('input[name="height"]').val();

	if (isNaN(x)) x = 1;
	if (isNaN(y)) y = 1;
	if (isNaN(z)) z = 1;
	console.log(x,y,z);

	scene.remove( rollOverMesh );
	rollOverGeo = new THREE.CubeGeometry( x * VOXEL_SIZE, z * VOXEL_SIZE,  y * VOXEL_SIZE, x,z,y);
	rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
	scene.add( rollOverMesh );
}

function setVoxelPosition( intersector ) {
	normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
	tmpVec.copy( intersector.face.normal );
	tmpVec.applyMatrix3( normalMatrix ).normalize();
	voxelPosition.addVectors( intersector.point, tmpVec );
	voxelPosition.x = Math.floor( voxelPosition.x / VOXEL_SIZE ) * VOXEL_SIZE + VOXEL_SIZE/2;
	voxelPosition.y = Math.floor( voxelPosition.y / VOXEL_SIZE ) * VOXEL_SIZE + VOXEL_SIZE/2;
	voxelPosition.z = Math.floor( voxelPosition.z / VOXEL_SIZE ) * VOXEL_SIZE + VOXEL_SIZE/2;
}

function setObjPosition( intersector ) {
	normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
	tmpVec.copy( intersector.face.normal );
	tmpVec.applyMatrix3( normalMatrix ).normalize();
	voxelPosition.addVectors( intersector.point, tmpVec );
	voxelPosition.x = Math.floor( voxelPosition.x / 50 ) * 50 + 25;
	voxelPosition.y = Math.floor( voxelPosition.y / 50 ) * 50 + 25;
	voxelPosition.z = Math.floor( voxelPosition.z / 50 ) * 50 + 25;
}

function onDocumentMouseMove( event ) {
	var container_x = event.pageX - $('#container').offset().left;
	var container_y = event.pageY - $('#container').offset().top;
	if (container_x >= 0 && container_x <= canvas_width && 
		container_y >= 0 && container_y <= canvas_height  ) {
		event.preventDefault;
		mouse2D.x = ( container_x / canvas_width) * 2 - 1;
		mouse2D.y = - ( container_y / canvas_height ) * 2 + 1;
		return false;
	}
	return true;
}

function onDocumentMouseDown( event ) {
	event.preventDefault();
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		intersector = getRealIntersector( intersects );
		if ( ctrlDown ) {
			if ( intersector.object != plane ) {
				scene.remove( intersector.object );
			}
		// create cube
		} else {
			intersector = getRealIntersector( intersects );
			setVoxelPosition( intersector );

			var newMesh = rollOverMesh.clone();
			newMesh.traverse( function ( child ) {
				if ( child instanceof THREE.Mesh ) {
					child.material  = new THREE.MeshBasicMaterial( { color: 0xfeb74c } );
				}
			} );
			newMesh.position.copy(voxelPosition);
			newMesh.matrixAutoUpdate = false;
			newMesh.updateMatrix();
			var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
			voxel.position.copy( voxelPosition );
			voxel.matrixAutoUpdate = false;
			voxel.updateMatrix();
			scene.add( newMesh );

		}

	}
}

function onDocumentKeyDown( event ) {
	switch( event.keyCode ) {
		case 16: shiftDown = true; break;
		case 17: ctrlDown = true; break;
	}
}

function onDocumentKeyUp( event ) {
	switch ( event.keyCode ) {
		case 16: shiftDown = false; break;
		case 17: ctrlDown = false; break;
	}
}


function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	if ( shiftDown ) {
		theta += mouse2D.x * 1.5;
	}

	raycaster = projector.pickingRay( mouse2D.clone(), camera );
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		intersector = getRealIntersector( intersects );
		if ( intersector ) {
			setVoxelPosition( intersector );
			rollOverMesh.position = voxelPosition;
		}
	}

	camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );

	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}

function loadObjects ( objects ) {
	for (var i in objects) {
		var obj = objects[i];
		loadObject(obj.object_id, obj.obj_file, obj.texture_file, obj.block_num, obj.blocks);
	}
}

// Dummy function to send object display info
function loadObject( id, objFile, textureFile, nBlocks, blocks ) {
	objLoader.load( "obj/" + "sphere.obj" , function (object) {
		object.scale = new THREE.Vector3 (20, 20, 20 );
		object.position.copy( plane.position );
		object.traverse( function ( child ) {
			if ( child instanceof THREE.Mesh ) {
				child.material  = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
			}
		} );
		objectMeshes[id] = object;
	});
}

// Dummy function to get object ID
function getObjectID( objectID ) {
	alert("ObjectID: " + objectID);
	scene.remove (rollOverMesh);
	rollOverMesh = objectMeshes[objectID];


	scene.add(rollOverMesh)
}