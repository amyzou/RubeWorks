function loadObjects ( objects ) {
	NObjectsToLoad = objects.length;
	for (var i in objects) {
		var obj = objects[i];
		loadObject(obj);
	}
}

function loadObject( obj ) {
	console.log("LOADING OBJECT id " + obj.id);

	if (obj.id == 4)
		JSONLoader.load( "models/ramp30.js", function(geometry) { 
			loadJSONGeometry (obj.id, geometry, obj.nBlocks, obj.blocks) ;
		} );
	else if (obj.id == 5)
		JSONLoader.load( "models/ball.js" , function(geometry) { 
			loadJSONGeometry (obj.id, geometry, obj.nBlocks, obj.blocks) ;
		} );
}

function loadJSONGeometry( id, geometry, nBlocks, blocks) {
    objectMeshes[id] = 
    { 
    	geometry : geometry,
    	nBlocks: nBlocks,
    	blocks: blocks
    };
    
    NObjectsToLoad--;
	if (NObjectsToLoad <= 0) {
		$(".object").click( function() {
			setCurrentObject(parseInt($(this).attr("id")),10);
		});
		setCurrentObject(0);
		animate();
	}
}

// on select object in toolbox
function setCurrentObject ( objectID ) {
	if (currMeshID == objectID) 
		return;

	scene.remove(rollOverMesh);
	if (objectID < 4 || objectID > 5 ) {
	
//	if (objectID < 1 || objectID + 1 >= objectMeshes.size ) {
		currMeshID = 0;
		rollOverMesh = new THREE.Mesh( cubeGeo, rollOverMaterial );
	} else {
		currMeshID = objectID;
		rollOverMesh = new THREE.Mesh( objectMeshes[objectID].geometry, rollOverMaterial );
		rollOverMesh.scale = scaleVec;
	}

	rollOverMesh.position = objectWorldPosition;
	scene.add(rollOverMesh);
}

function updateObjectPosition( intersector ) {
	normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
	tmpVec.copy( intersector.face.normal );
	tmpVec.applyMatrix3( normalMatrix ).normalize();
	objectWorldPosition.addVectors( intersector.point, tmpVec );

	objectWorldPosition.x = Math.floor( objectWorldPosition.x / VOXEL_SIZE ) * VOXEL_SIZE + VOXEL_SIZE/2;
	objectWorldPosition.y = Math.floor( objectWorldPosition.y / VOXEL_SIZE ) * VOXEL_SIZE + VOXEL_SIZE/2;
	objectWorldPosition.z = Math.floor( objectWorldPosition.z / VOXEL_SIZE ) * VOXEL_SIZE + VOXEL_SIZE/2;
	
	gridPosition.x = Math.round(objectWorldPosition.x/VOXEL_SIZE + (GRID_SIZE - 1)/2);
	gridPosition.y = Math.round((objectWorldPosition.y - plane.position.y)/VOXEL_SIZE - 0.5);
	gridPosition.z = Math.round(objectWorldPosition.z/VOXEL_SIZE + (GRID_SIZE - 1)/2);
}

function rotateCurrentObject(){
	
}

function addObjectToScene( intersector, intersects ){
	updateObjectPosition( intersector );

	var newMesh = new THREE.Mesh(rollOverMesh.geometry.clone(), defaultMaterial);
	if (currMeshID != 0) {
		var scale = objectMeshes[currMeshID].scaleFactor;
		newMesh.scale = scaleVec;
	}

	newMesh.position.copy(objectWorldPosition);
	scene.add( newMesh );
	sceneObjects[currSceneID] = newMesh;
	//CreateRubeJect ( currMeshID, currSceneID );
	console.log("added new mesh id = " + currSceneID);
	currSceneID++;
}