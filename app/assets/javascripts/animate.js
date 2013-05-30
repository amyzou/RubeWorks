function animate() {
	if (pause) return;
	requestAnimationFrame( animate );
	render();
}

function render() {
	if ( shiftDown ) {
		theta += mouse2D.x * 1.5;
	}

	camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );
	if (buildMode) {
		updateBuildScene();
	} else {
		//runObjectAnimations();
	}
	renderer.render( scene, camera );	
}

function updateBuildScene(){
	raycaster = projector.pickingRay( mouse2D.clone(), camera );
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		intersector = getRealIntersector( intersects );
		if ( intersector ) {
			updateObjectPosition( intersector );
			rollOverMesh.position = objectWorldPosition;
		}
	}
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

function switchMode(){
	pause = true;
	$(".button").hide();
	$('.loading').show();
	if (buildMode){
		camera.position.y = 1000;
		tempCopy = new Array(currSceneID);
		for (var i in sceneObjects) {
			tempCopy[i] = sceneObjects[i].position.clone(); 
		}
		$('.buildmode').fadeOut();
		$('.runmode').fadeIn();
		buildMode = false;
	} else {
		camera.position.y = 500;
		for (var i in tempCopy) {
			sceneObjects[i].position.copy(tempCopy[i]); //reset default position			
		}
		$('.buildmode').fadeIn();
		$('.runmode').fadeOut();
		buildMode = true;
	}
	$('.loading').hide();
	pause = false;
}