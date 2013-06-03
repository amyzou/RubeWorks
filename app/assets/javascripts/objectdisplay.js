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
    	material : defaultMaterial,
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
		JSONLoader.load( "obj/" + obj.obj_file, function(geometry, mat) {
			loadJSONGeometry (obj.id, geometry , mat) ;
			NObjectsToLoad--;
			if (NObjectsToLoad <= 0) startAnimation();
		} );		
		return;
	}

	NObjectsToLoad--;
	if (NObjectsToLoad <= 0) startAnimation();
}

function loadJSONGeometry( id, geometry, material) {
	THREE.GeometryUtils.center(geometry);
    objectMeshes[id].geometry = geometry;
   	if (material != undefined) 
   		objectMeshes[id].material = new THREE.MeshFaceMaterial( material );
   	if (objectMeshes[id].category == 'gadget') 
   		objectMeshes[id].material.morphTargets = true;

	objectMeshes[id].scale.set(
			objectMeshes[id].dimensions[0]/(geometry.boundingBox.max.x - geometry.boundingBox.min.x),
			objectMeshes[id].dimensions[2]/(geometry.boundingBox.max.y - geometry.boundingBox.min.y),
			objectMeshes[id].dimensions[1]/(geometry.boundingBox.max.z - geometry.boundingBox.min.z)
	);
	objectMeshes[id].scale.multiplyScalar(VOXEL_SIZE);
}

// on select object in toolbox
function setCurrentObject ( id) {
	if (currMeshID == id) return;
	
	currMeshID = id;
	currObj = objectMeshes[id];
	currRotation = 0;
	currOffset = currObj.offsets[0];

	scene.remove(rollOverMesh);

	rollOverMesh = new THREE.Mesh( objectMeshes[id].geometry , rollOverMaterial);
	rollOverMesh.scale = objectMeshes[id].scale;
	rollOverMesh.position.copy(objectWorldPosition);

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
	gridPosition[2] = Math.round(objectWorldPosition.y/VOXEL_SIZE - 0.5);

	var color = (canPlaceObject()) ? 0xfcd87f : 0xb93131;
	rollOverMesh.material.color.setHex( color );
	rollOverMesh.material.ambient.setHex( color );
	objectWorldPosition.add(currOffset);
}

function rotateCurrentObject(){
	currRotation = (currRotation+1)%4;
	rollOverMesh.rotateOnAxis( ROTATION_AXIS, Math.PI / 2);
	if (currObj.block_num == 1) return;
	currOffset = currObj.offsets[currRotation % 2];
}

function removeObjectFromScene( object ){
	scene.remove(object);	
	for ( var id in sceneObjects ){
		if (sceneObjects[id] == object ){
			sceneObjects[id] = undefined;
			controller.ModifyObject_Delete(id);
		}
	}
}

function canPlaceObject() {
	var blocks = currObj.blocks;
	if ( currObj.block_num > 1 ) blocks = blocks[currRotation];
	if (!controller.CanPlaceObject( blocks , gridPosition, currObj.category)) {
		//console.log("no place");
		return false;
	}
	return true;
}

function addObjectToScene( intersector, intersects ){
	updateObjectPosition( intersector );
	if (currObj == undefined || !canPlaceObject())
		return;

	//create new mesh, add to scene and create Rubeject()
	var newMesh;
	if (currObj.category != 'gadget') 
		newMesh = new THREE.Mesh(rollOverMesh.geometry.clone(), currObj.material );
	else 
		newMesh = new THREE.MorphAnimMesh(rollOverMesh.geometry.clone(), currObj.material );
	newMesh.scale.copy(rollOverMesh.scale);
	newMesh.rotation.copy(rollOverMesh.rotation);
	newMesh.position.copy(rollOverMesh.position);

	if (newMesh.material.morphTargets) {
		newMesh.updateMorphTargets();
		newMesh.currframe = 0;
	}
	scene.add( newMesh );
	sceneObjects[currSceneID] = newMesh;
	controller.AddObject(currMeshID, currSceneID, gridPosition, currRotation);
	//console.log("added new mesh id = " + currSceneID);
	currSceneID++;
}

function UpdateObjectInScene(id, rel_gx, rel_gy, rel_gz ) {
	movement_delta.set(rel_gx, rel_gz, rel_gy);
	movement_delta.multiplyScalar(VOXEL_SIZE);
	sceneObjects[id].position.add( movement_delta );
}