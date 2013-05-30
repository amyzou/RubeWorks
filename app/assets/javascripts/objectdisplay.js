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
			loadJSONGeometry (obj, geometry ) ;
		} );		
	}

	else if (obj.id == 5) {
		JSONLoader.load( "models/ball.js" , function(geometry) { 
			loadJSONGeometry (obj, geometry ) ;
		} );
	}
	else {
		objectMeshes[obj.id] = 
	    { 
	    	geometry : cubeGeo,
	    	block_num: obj.block_num,
	    	blocks: obj.blocks
	    };
	} 
}

function loadJSONGeometry( obj, geometry) {
    objectMeshes[obj.id] = 
    { 
    	geometry : geometry,
    	block_num: obj.block_num,
    	blocks: obj.blocks,
    	category: obj.category

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
	currMeshID = objectID;
	rollOverMesh = new THREE.Mesh( objectMeshes[objectID].geometry, rollOverMaterial );
	var scale = 1;
	if (currMeshID == 5) 
		scale = 25;//objectMeshes[currMeshID].scaleFactor;
	rollOverMesh.scale = new THREE.Vector3(scale, scale, scale);
	if (currMeshID == 4) {
		rollOverMesh.scale.x = 25 * 1.5;
		rollOverMesh.scale.y = 25 * 1.5;
		rollOverMesh.scale.z = 25 * 1.9;
	}
	rollOverMesh.position = objectWorldPosition;
	scene.add(rollOverMesh);
}

function updateObjectPosition( intersector ) {
	var offset = new THREE.Vector3(VOXEL_SIZE/2,VOXEL_SIZE/2,VOXEL_SIZE/2);
	if (currMeshID == 4) {
		offset.x = -VOXEL_SIZE * 3/2;
		offset.y = 0;
		offset.z = VOXEL_SIZE;
	}
	normalMatrix.getNormalMatrix( intersector.object.matrixWorld );
	tmpVec.copy( intersector.face.normal );
	tmpVec.applyMatrix3( normalMatrix ).normalize();
	objectWorldPosition.addVectors( intersector.point, tmpVec );

	objectWorldPosition.x = Math.floor( objectWorldPosition.x / VOXEL_SIZE ) * VOXEL_SIZE + offset.x;
	objectWorldPosition.y = Math.floor( objectWorldPosition.y / VOXEL_SIZE ) * VOXEL_SIZE + offset.y;
	objectWorldPosition.z = Math.floor( objectWorldPosition.z / VOXEL_SIZE ) * VOXEL_SIZE + offset.z;
	
	gridPosition[0] = Math.round((objectWorldPosition.x - offset.x)/VOXEL_SIZE + (GRID_SIZE)/2);
	gridPosition[1] = Math.round((objectWorldPosition.z - offset.z)/VOXEL_SIZE + (GRID_SIZE)/2);
	gridPosition[2] = Math.round((objectWorldPosition.y - offset.y)/VOXEL_SIZE);
}

function rotateCurrentObject(){
	currRotation = (currRotation+1)%4;
	console.log("ROTATE " + currRotation);
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
	var obj = objectMeshes[currMeshID];
	if (obj == undefined) return;
	if ( obj.block_num == 1 ) {
		if (!controller.CanPlaceObject( obj.blocks, gridPosition, obj.category)) {
			console.log("NICE TRY MUDDERFUCKA");
			return false;
		}
	} else {
		console.log("NICE TRY MUDDERFUCKA");
		if (!controller.CanPlaceObject( obj.blocks[currRotation], gridPosition, obj.category)) {
			console.log("NICE TRY MUDDERFUCKA");
			return false;
		}	
	}
			
	var newMesh = new THREE.Mesh(rollOverMesh.geometry.clone(), defaultMaterial);
	newMesh.scale.copy(rollOverMesh.scale);
	newMesh.position.copy(objectWorldPosition);
	scene.add( newMesh );
	sceneObjects[currSceneID] = newMesh;
	controller.AddObject(new RubeJect ( currObjPropertyId, gridPosition, currRotation));
	console.log("added new mesh id = " + currSceneID);
	currSceneID++;
}