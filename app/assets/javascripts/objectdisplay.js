function loadObjects ( objects ) {
	NObjectsToLoad = objects.length;
	for (var i in objects) {
		var obj = objects[i];
		loadObject(obj.id, obj.obj_file, obj.texture_file, obj.block_num, obj.blocks);
	}
}

function loadObject( id, objFile, textureFile, nBlocks, blocks ) {
	console.log("LOADING OBJECT id " + id);

	var material = new THREE.MeshBasicMaterial( { color: 0xfeb74c } );
	JSONLoader.load( "models/ball.js", function( geometry ) {
		geometry.computeBoundingSphere();
        objectMeshes[id] = 
        { 
        	geometry : geometry,
        	nBlocks: nBlocks,
        	blocks: blocks,
        	scaleFactor: 25
        };
        	NObjectsToLoad--;
		if (NObjectsToLoad <= 0) {
			$(".object").click( function() {
				setCurrentObject(parseInt($(this).attr("id")),10);
			});
			$(".object").first().click();
			animate();
		}
    } );
}

// on select object in toolbox
function setCurrentObject ( objectID ) {
	console.log( objectMeshes );
	currMeshID = objectID;
	scene.remove(rollOverMesh);
	
	rollOverMesh = new THREE.Mesh( objectMeshes[objectID].geometry, rollOverMaterial );
	rollOverMesh.position = new THREE.Vector3(0,0,0);
	rollOverMesh.scale = new THREE.Vector3( objectMeshes[objectID].scaleFactor, objectMeshes[objectID].scaleFactor, objectMeshes[objectID].scaleFactor );
	
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