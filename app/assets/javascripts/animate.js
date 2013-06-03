function startAnimation(){
	$(".object").click( function() {
		setCurrentObject(parseInt($(this).attr("id"),10));
	});
	setCurrentObject(1);
	$('.loading').hide();
	animate();
}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	if (pause) return;
	if ( cameraRotateMode ) {
		theta += mouse2D.x * 1.5;
	}

	camera.position.x = 1400 * Math.sin( THREE.Math.degToRad( theta ) );
	camera.position.z = 1400 * Math.cos( THREE.Math.degToRad( theta ) );
	camera.lookAt( scene.position );
	if (buildMode) {
		updateBuildScene();
	} else {
		//console.log("animating...");
		pause = !controller.UpdateAnimation();
	}
	renderer.render( scene, camera );	
}

function updateBuildScene(){
	if ( deleteMode ) rollOverMesh.visible = false;
	else rollOverMesh.visible = true;
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
	for( idx = 0; idx < intersects.length; idx++ ) {
		intersector = intersects[ idx ];
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
		rollOverMesh.visible = false;
		camera.position.y = 1000;
		tempCopy = new Array(currSceneID);
		for (var i in sceneObjects) {
			if (sceneObjects[i])
				tempCopy[i] = sceneObjects[i].position.clone(); 
		}
		$('.buildmode').fadeOut();
		$('.runmode').fadeIn();
		buildMode = false;
		controller.CreateChains();
		controller.PrintGrid();
		controller.PrintAllObjects();
		controller.InitiateAnimation();
	} else {
		camera.position.y = 600;
		for (var i in tempCopy) {
			sceneObjects[i].position.copy( tempCopy[i] ); //reset default position			
		}
		$('.buildmode').fadeIn();
		$('.runmode').fadeOut();
		buildMode = true;
		rollOverMesh.visible = true;
	}
	$('.loading').hide();
	console.log("switch to " + buildMode? "build" : "run");
	pause = false;
}