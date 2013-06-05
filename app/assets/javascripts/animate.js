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
		buildMode = false;
		switchToRunMode();
	} else {
		switchToBuildMode();
	}
	$('.loading').hide();
	console.log("switch to " + buildMode? "build" : "run");
	pause = false;
}


function switchToRunMode(){
	rollOverMesh.visible = false;
	camera.position.y = 630;
	
	canvas_height = 550;
	resizeViewport();

	saveState = new Array(currSceneID);
	for (var i in sceneObjects) {
		if (sceneObjects[i])
			saveState[i] = sceneObjects[i].position.clone(); 
	}

	$('.buildmode').fadeOut();
	$('.runmode').fadeIn();
		
	controller.PrintGrid();
	controller.CreateChains();
	console.log(controller.GetChains());
	controller.InitiateAnimation();
}

function switchToBuildMode(){
	camera.position.y = 500;

	canvas_height = 450;
	resizeViewport();

	for (var i in saveState) {
		sceneObjects[i].position.copy( saveState[i] ); //reset default position			
	}

	resetGadgets();
	
	$('.buildmode').fadeIn();
	$('.runmode').fadeOut();
	buildMode = true;
	rollOverMesh.visible = true;
}

function resetGadgets(){
	var delta;
	for (var i in gadgets){
		var g = gadgets[i];
		g.morphTargetInfluences[ g.lastKeyframe ] = 0;
		g.morphTargetInfluences[ g.currentKeyframe ] = 0;
		g.morphTargetInfluences[ 0 ] = 1;
		g.lastKeyframe = 0;
		g.currentKeyframe = 0;
	}
}