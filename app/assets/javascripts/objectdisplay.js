function loadObjects ( objects ) {
	NObjectsToLoad = objects.length;
	for (var i in objects) {
		var obj = objects[i];
		loadObject(obj);
	}
}

function loadObject( obj ) {
	var blocks = obj.blocks;

	objectMeshes[obj.id] = 
   	{ 
    	geometry : cubeGeo,
    	block_num: obj.block_num,
    	blocks: new Array((obj.block_num > 1 ? 4 : 1)),
		category: obj.category
    };

    //CLONE_ARRAY;
    if (obj.block_num == 1){
    	objectMeshes[obj.id].blocks[0] = blocks[0].slice(0);
    } else {
    	for (var rot = 0; rot < 4; rot++){
    		objectMeshes[obj.id].blocks[ rot ] = new Array( obj.block_num ); //each rot = 1 blocklist
    		for (var i = 0; i < obj.block_num; i++){
    			objectMeshes[obj.id].blocks[ rot ][ i ] = blocks[rot][i].slice(0);
    		}
    	}
    }

	if (obj.id == 5){
		objectMeshes[obj.id].geometry =  new THREE.SphereGeometry( VOXEL_SIZE/2, 10, 8);
	} else if (obj.objFile == ''){
		JSONLoader.load( "models/" + obj.objFile, function(geometry) { 
			loadJSONGeometry (obj.id, geometry ) ;
		} );		
	}
	NObjectsToLoad--;
}

function loadJSONGeometry( id, geometry) {
    objectMeshes[id].geometry = geometry;
    
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
	console.log(currMeshID);
	console.log( objectMeshes[currMeshID].blocks);
	var obj = objectMeshes[currMeshID];
	if (obj == undefined) return;
	if ( obj.block_num == 1 ) {
		console.log(objectMeshes[currMeshID]);
		if (!controller.CanPlaceObject( obj.blocks , gridPosition, obj.category)) {
			console.log("NICE TRY MUDDERFUCKA");
			return false;
		}
	} else {
		console.log(obj.blocks[currRotation]);
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
	controller.AddObject(new RubeJect ( currMeshID, gridPosition, currRotation));
	console.log("added new mesh id = " + currSceneID);
	currSceneID++;
}

function UpdateObjectInScene(id, rel_gx, rel_gy, rel_gz ) {
	console.log("OLD POSITION: ");
	console.log(sceneObjects[id].position);
	var grid_delta = new Vector3(rel_gx, rel_gz, rel_gy)
	console.log("CHANGE BY: ");
	console.log(grid_delta);
	grid_delta.multiplyScalar(VOXEL_SIZE);
	console.log(grid_delta);

	sceneObjects[id].position.add( grid_delta );
	console.log("NEW POSITION: ");
	console.log(sceneObjects[id].position);
}