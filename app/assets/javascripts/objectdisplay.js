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
    	block_num: obj.block_num,
    	blocks: obj.blocks,
		category: obj.category,
		scale: new THREE.Vector3(1,1,1),
		dimensions: obj.dimensions
    };

	if (obj.image_file == 'sphere.png' ) {
		objectMeshes[obj.id].geometry =  new THREE.SphereGeometry( VOXEL_SIZE/2, 10, 8);
	} else if (obj.obj_file != "" ){
		JSONLoader.load( "obj/" + obj.obj_file, function(geometry) { 
			loadJSONGeometry (obj.id, geometry ) ;
		} );		
	}
	NObjectsToLoad--;
}

function loadJSONGeometry( id, geometry) {
    objectMeshes[id].geometry = geometry;
   	geometry.computeBoundingBox();

   objectMeshes[id].scale.set(
   		objectMeshes[id].dimensions[0]/(geometry.boundingBox.max.x - geometry.boundingBox.min.x),
   		objectMeshes[id].dimensions[2]/(geometry.boundingBox.max.y - geometry.boundingBox.min.y),
   		objectMeshes[id].dimensions[1]/(geometry.boundingBox.max.z - geometry.boundingBox.min.z)
	);
   objectMeshes[id].scale.multiplyScalar(VOXEL_SIZE);

    console.log(objectMeshes[id].scale);

	if (NObjectsToLoad <= 0) {
		$(".object").click( function() {
			setCurrentObject(parseInt($(this).attr("id")),10);
		});
		setCurrentObject(1);
		animate();
	}
}

// on select object in toolbox
function setCurrentObject ( objectID ) {
	if (currMeshID == objectID) return;
	currMeshID = objectID;
	console.log(objectMeshes[objectID].geometry );
	scene.remove(rollOverMesh);

	rollOverMesh = new THREE.Mesh( objectMeshes[objectID].geometry , rollOverMaterial);
	rollOverMesh.scale = objectMeshes[objectID].scale;
	rollOverMesh.position = objectWorldPosition;

	offset.y = VOXEL_SIZE * objectMeshes[objectID].dimensions[2] * 0.5;
	scene.add(rollOverMesh);
}

function updateObjectPosition( intersector ) {
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

	var blocks = obj.blocks;
	if ( obj.block_num > 1 ) blocks = blocks[currRotation];
	if (!controller.CanPlaceObject( blocks , gridPosition, obj.category)) {
		console.log("no place");
		return false;
	}
	//create new mesh, add to scene and create Rubeject()
	var newMesh = new THREE.Mesh(rollOverMesh.geometry.clone(), defaultMaterial);
	newMesh.scale.copy(rollOverMesh.scale);
	newMesh.position.copy(objectWorldPosition);

	scene.add( newMesh );
	sceneObjects[currSceneID] = newMesh;
	controller.AddObject(new RubeJect ( currMeshID, gridPosition, currRotation));
	currSceneID++;
}

function UpdateObjectInScene(id, rel_gx, rel_gy, rel_gz ) {
	movement_delta.set(rel_gx, rel_gz, rel_gy);
	movement_delta.multiplyScalar(VOXEL_SIZE);
	sceneObjects[id].position.add( movement_delta );
}