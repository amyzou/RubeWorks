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

	var color = (canPlaceObject()) ? currColor : "ff0000";
	rollOverMesh.material.color.set( color );
	rollOverMesh.material.ambient.set( color );
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
			sceneObjects[id].material.dispose();
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

	if (currObj.category == 'gadget'){
		newMesh = new THREE.MorphAnimMesh( currObj.geometry , new THREE.MeshLambertMaterial( { color: currColor, ambient: currColor, shading: THREE.FlatShading, morphTargets: true } ));
		newMesh.updateMorphTargets();
		newMesh.setAnimationLabel("full", 0, newMesh.geometry.morphTargets.length - 1);
		newMesh.playAnimation("full", FRAMES_PER_SEC);
		gadgets.push(newMesh);
	} else if (currObj.category == 'starter'){
		newMesh = new THREE.Mesh( currObj.geometry , new THREE.MeshLambertMaterial( { color: "#00ff00" , ambient: "#00ff00", shading: THREE.FlatShading } )); 
	} else 
		newMesh = new THREE.Mesh( currObj.geometry , new THREE.MeshLambertMaterial( { color: currColor , ambient: currColor, shading: THREE.FlatShading } )); 

		
	newMesh.scale.copy(rollOverMesh.scale);
	newMesh.rotation.copy(rollOverMesh.rotation);
	newMesh.position.copy(rollOverMesh.position);

	scene.add( newMesh );
	sceneObjects[currSceneID] = newMesh;
	controller.AddObject(currMeshID, currSceneID, gridPosition, currRotation);
	currSceneID++;
}

function UpdateObjectInScene(id, rel_gx, rel_gy, rel_gz ) {
	if (sceneObjects[id] == null) return false;
	movement_delta.set(rel_gx, rel_gz, rel_gy);
	movement_delta.multiplyScalar(VOXEL_SIZE);
	sceneObjects[id].position.add( movement_delta );
}

function UpdateGadget(id, nFrames ){
	var gadget = sceneObjects[id];
	if (gadget == null) return true;

	var delta = nFrames * FRAMES_PER_SEC;
	if (delta > gadget.duration - gadget.time ) {
		gadget.updateAnimation(gadget.duration - gadget.time);
		return true;		
	}
	gadget.updateAnimation( delta );
	THREE.GeometryUtils.center(gadget.geometry);
	return false;
}

function clearScene(){
	for ( var id in sceneObjects ){
		if (sceneObjects[id] != null ){
			scene.remove(sceneObjects[id]);
			sceneObjects[id].material.dispose();
		}
	}
	controller.ReInitializeAll();
}