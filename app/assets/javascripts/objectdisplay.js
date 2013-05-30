function loadObjects ( objects ) {
	NObjectsToLoad = objects.length;
	for (var i in objects) {
		var obj = objects[i];
		loadObject(obj);
	}
}

function loadObject( obj ) {
	console.log(obj);
	if (obj.id == 4) {
		JSONLoader.load( "models/ramp30.js", function(geometry) { 
			loadJSONGeometry (obj.id, geometry, obj.block_num, obj.blocks) ;
		} );		
	}

	else if (obj.id == 5) {
		JSONLoader.load( "models/ball.js" , function(geometry) { 
			loadJSONGeometry (obj.id, geometry, obj.block_num, obj.blocks) ;
		} );
	}
}

function loadJSONGeometry( id, geometry, block_num, blocks) {
    objectMeshes[id] = 
    { 
    	geometry : geometry,
    	block_num: block_num,
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
	if (currObjPropertyId == objectID) return;
	currObjPropertyId = objectID;

	scene.remove(rollOverMesh);
	if (objectID < 4 || objectID > 5 ) {
		//if (objectID < 1 || objectID + 1 >= objectMeshes.size )
		currMeshID = 1;
		rollOverMesh = new THREE.Mesh( cubeGeo, rollOverMaterial );
	} else {
		currMeshID = objectID;
		rollOverMesh = new THREE.Mesh( objectMeshes[objectID].geometry, rollOverMaterial );
		var scale = 25;//objectMeshes[currMeshID].scaleFactor;
		rollOverMesh.scale = new THREE.Vector3(scale, scale, scale);
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
	
	gridPosition[0] = Math.round(objectWorldPosition.x/VOXEL_SIZE + (GRID_SIZE - 1)/2);
	gridPosition[1] = Math.round(objectWorldPosition.z/VOXEL_SIZE + (GRID_SIZE - 1)/2);
	gridPosition[2] = Math.round((objectWorldPosition.y - plane.position.y)/VOXEL_SIZE - 0.5);
}

function checkGridPosition( pos , block ){
	console.log(pos);
	console.log(block);
	if (pos[0] + block[0] < 0 || pos[0] + block[0] >= GRID_SIZE &&
		pos[1] + block[1] < 0 || pos[1] + block[1] >= GRID_SIZE &&
		pos[2] + block[2] < 0 || pos[2] + block[2] >= GRID_HEIGHT)
			return false;

	return controller.ContainsObject (pos[0], pos[1], pos[2]);
}

function rotateCurrentObject(){
}

function removeObjectFromScene( object ){
	scene.remove(object);
	for ( var obj in sceneObjects ){
		if (sceneObjects[obj] == object ){
			sceneObjects[obj] = undefined;
		}
	}
}

function addObjectToScene( intersector, intersects ){
	updateObjectPosition( intersector );
	if (currMeshID == 1) {
		if (!checkGridPosition(gridPosition, [0,0,0])) {
			console.log("NICE TRY MUTHERFUCKA");
			return false;
		}
	} else {
		var blocks = objectMeshes[currMeshID].blocks;
		console.log(objectMeshes[currMeshID]);
		for (var n = 0; n < objectMeshes[currMeshID].block_num; n++ ){
			if (!checkGridPosition(gridPosition, blocks[i] )) {
				console.log("NICE TRY MUTHERFUCKA");
				return false;
			}
		}	
	}
			
	var newMesh = new THREE.Mesh(rollOverMesh.geometry.clone(), defaultMaterial);
	newMesh.scale.copy(rollOverMesh.scale);
	newMesh.position.copy(objectWorldPosition);
	scene.add( newMesh );
	sceneObjects[currSceneID] = newMesh;
	controller.AddObject(new RubeJect ( currObjPropertyId, gridPosition, false));
	console.log("added new mesh id = " + currSceneID);
	currSceneID++;
}