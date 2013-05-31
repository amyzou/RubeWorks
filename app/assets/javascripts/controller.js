 /* the way face works:
  * x, y, z, facenum
  * facenums (
  * looking down from z:
  * y |  +-0-+
  *   | 3|   |1
  *   |  +-2-+
  * --+-------------
  *   |  x
  *
  * looking from -y:
  * z |  +-5-+
  *   |  |   |
  *   |  +-4-+
  * --+-------------
  *   |  x
  * while making list, needs to check for :
  * object type
  * 
  * when animating, keeps running object state
  */

  /*-----------------Main RubJect Controller Class-----------------*/
  /*
	Workflow:
	1. Add starting objects with the method; 
	this puts the starting objects on a list
		so we keep track of starting points. What we 
	2. When the person switches to run mode, 
		iterate through all starting objects,
		create chain for all, append freefalls when needed in this stage
		//Todo: a function that adds freefall onto things if applicable
  */

function RubeJectController(){

	/*-----------------Basic functionality-----------------*/

	var objectSceneIDList = new Array();
	var objectSceneIDCounter = 0;
	var startingObjectList = new Array();
	var startingObjectCounter = 0;
	var mainGrid;
	
	
	var PlaceObjectIntoSpace = function(sceneID){
		var blockList = objectSceneIDList[sceneID].blockList;
		var position  = objectSceneIDList[sceneID].position;
		// Iterate through blockList to add all blocks
		for (var i = 0; i < blockList.length; i++ ){
			// Absolute positions of blocks
			var x = blockList[i][0] + position[0],
			    y = blockList[i][1] + position[1],
			    z = blockList[i][2] + position[2];

			// Set sceneID in grid.
			mainGrid[x][y][z] = sceneID;
		}
	}

	var InitializeGrid = function() {
		mainGrid = new Array(GRID_SIZE);
		for ( var x = 0; x < GRID_SIZE; x++ ) {
			mainGrid[x] = new Array(GRID_SIZE);
			for ( var y = 0; y < GRID_SIZE; y++ ) {
				mainGrid[x][y] = new Array(GRID_HEIGHT);
				for (var z = 0; z < GRID_SIZE; z++) {
					mainGrid[x][y][z] = null;
				}
			}
		}
	}
	InitializeGrid();	

	var RemoveObjectFromSpace = function(sceneID){
		//delete object from space grid
		var blockList = objectSceneIDList[sceneID].blockList;
		var position  = objectSceneIDList[sceneID].position;
		for (var i = 0; i < blockList.length; i++ ){
			mainGrid[blockList[i][0] + position[0]] 
					[blockList[i][1] + position[1]] 
					[blockList[i][2] + position[2]] = null;
		}
	}

	var createChainEntry = function(carrierID, roamerID, outface) {
		var chainEntry = new Array();
		chainEntry[0]  = carrierID;
		chainEntry[1]  = roamerID;
		chainEntry[2]  = outface;
		return chainEntry;
	}

	var GetAbsoluteFace = function(face, position) {
		face[0] += position[0];
		face[1] += position[1];
		face[2] += position[2];
		return face;
	}

	var GetRelativeFace = function(face, position) {
		face[0] -= position[0];
		face[1] -= position[1];
		face[2] -= position[2];
		return face;	
	}

	var ContainsObject = function(x,y,z) {
		if (mainGrid[x][y][z] != null) {
			return true;
		}
		return false;
	}

	this.CanPlaceObject = function(blockList, pos, category) {
		for (var i = 0; i < blockList.length; i++) {
			var translatedPos = pos.slice(0);
			translatedPos[0] += blockList[i][0];
			translatedPos[1] += blockList[i][1];
			translatedPos[2] += blockList[i][2];
			console.log(translatedPos);
			if (!allWithinLimits(translatedPos)) {
				console.log("Out of limits.");
				return false;
			} 
			if (ContainsObject(translatedPos[0], translatedPos[1], translatedPos[2])) {
				console.log("Intersection.");
				return false;
			} 
		}
		// Roamers and gadgets must be on an inert or ground
		if (category == "roamer" || category == "gadget" || category == "carrier") {
			var groundBlocks = GetGroundBlocks(blockList, pos); 
			for (var i = 0; i < groundBlocks.length; i++) {
				if (!OnGroundOrInert(groundBlocks[i])) {
					console.log("Floating/not on inert.");
					return false;
				}
			}
		} 
		return true;

	}

	var GetGroundBlocks = function (blockList, pos) {
		var groundBlocks = new Array();
		for (var i = 0; i < blockList.length; i++) {
			if (blockList[i][2] === 0) {
				blockList[i][0] += pos[0];
				blockList[i][1] += pos[1];
				blockList[i][2] += pos[2];
				groundBlocks.push(blockList[i]);
			}
		}
		return groundBlocks;
	}


	//method to add object
	this.AddObject = function(rubeJect){
		var isStartingObject = rubeJect.category === "starter";
		//console.log("Adding: " + rubeJect.position + ";" + objectSceneIDCounter);
		objectSceneIDList[objectSceneIDCounter] = rubeJect;
		PlaceObjectIntoSpace(objectSceneIDCounter);
		if (isStartingObject) {
			startingObjectList[startingObjectCounter] = new Array();
			var outface = 
				GetAbsoluteFace(rubeJect.getOutFaceByIndex(0), 
								rubeJect.position);
			startingObjectList[startingObjectCounter][0] = 
				createChainEntry(-1, objectSceneIDCounter, outface);
			startingObjectCounter ++;
		}
		objectSceneIDCounter ++;
	};

	this.ModifyObject_Delete = function(sceneID){
		RemoveObjectFromSpace(sceneID);
		objectSceneIDList[sceneId] = null;
	}

	this.ModifyObject_Move = function(sceneID, newLocation){
		RemoveObjectFromSpace(sceneID);
		objectSceneIDList[sceneID].position = newLocation;
		PlaceObjectIntoSpace(objectSceneIDCounter);
	}

	/* legacy/extension?
	this.ModifyObject_Rotate = function(sceneID, newRotation){
		//todo
		RemoveObjectFromSpace(sceneID);
		//ask to rotate
	}
	*/

	//quick method to see if the faces are the same
	var IsSameFace = function(faceA, faceB){
		switch(faceA[3]){
			case 0:
				if (faceA[0] == faceB[0] 
			  		&& faceA[2] == faceB[2]
			  		&& (faceA[1] + 1 == faceB[1])
			  		&& faceB[3] == 2) return true;
			  	else return false;
			case 1:
				if (faceA[1] == faceB[1] 
					&& faceA[2] == faceB[2] 
					&& (faceA[0] + 1 == faceB[0]) 
					&& faceB[3] == 3) return true;
				else return false;
			case 2:
			  	if (faceA[0] == faceB[0] 
			  		&& faceA[2] == faceB[2]
			  		&& (faceA[1] == faceB[1] + 1)
			  		&& faceB[3] == 0) return true;
			  	else return false;
			case 3:
			  	if (faceA[1] == faceB[1] 
				  	&& faceA[2] == faceB[2]
			  		&& (faceA[0] == faceB[0] + 1)
			  		&& faceB[3] == 1) return true;
			  	else return false;
			case 4:
			  	if (faceA[0] == faceB[0] 
			  		&& faceA[1] == faceB[1]
			  		&& faceA[2] == faceB[2] + 1
			  		&& faceB[3] == 5) return true;
			  	else return false;
			case 5:
			  	if (faceA[0] == faceB[0] 
			  		&& faceA[1] == faceB[1]
			  		&& faceA[2] + 1 == faceB[2]
			  		&& faceB[3] == 4) return true;
			  	else return false;
			default: return false;
		}
	}
  
	// Retrieve next block from pos and direction.
	var GetNextBlock = function(pos,direction){
		var nextPos = pos.slice(0);
		switch(direction){
			case 0:	nextPos[1] += 1; break;
			case 1: nextPos[0] += 1; break;
			case 2:	nextPos[1] -= 1; break;
			case 3:	nextPos[0] -= 1; break;
			case 4:	nextPos[2] -= 1; break;
			case 5:	nextPos[2] += 1; break;
		}
		return nextPos;
	}

	var GetOutface = function(pos,direction) {
		var outface = pos.slice(0);
		outface[3] = direction;
		return outface;
	}

	var GetPositionFromFace = function(face) {
		return face.slice(0,3);
	}

	var GetObjectFromGrid = function(pos) {
		if (mainGrid[pos[0]][pos[1]][pos[2]] == null 
			|| isUndefined(mainGrid[pos[0]][pos[1]][pos[2]])) 
			return null;
		else return mainGrid[pos[0]][pos[1]][pos[2]];
	}

	var OnGroundOrInert = function(pos) {
		// Is ground.
		if (pos[2] == 0) return true;

		// Otherwise check below.
		var belowID = mainGrid[pos[0]][pos[1]][pos[2]-1];
		if (objectSceneIDList[belowID] == null) return false;
		if (objectSceneIDList[belowID].category === "inert") {
			return true;
		}
		return false;
	}

	var allWithinLimits = function(pos) {
		for (var i = 0; i < 6; i++) {
			if (!isWithinLimits(pos,i))
				return false;
		}
		return true;
	}

	var isWithinLimits = function(pos,direction){
		switch(direction){
			case 0:	return pos[1] < GRID_SIZE;
			case 1: return pos[0] < GRID_SIZE;
			case 2:	return pos[1] >= 0;
			case 3:	return pos[0] >= 0;
			case 4:	return pos[2] >= 0;
			case 5:	return pos[2] < GRID_SIZE;
		}
	}

	var getInface = function(pos,face) {
		var inface = pos.slice(0);
		inface[3] = face;
		return inface;
	}

	var getOppositeDirection = function(direction) {
		switch(direction){
			case 0:	return 2;
			case 1: return 3;
			case 2:	return 0;
			case 3:	return 1;
			case 4:	return 5;
			case 5:	return 4;
		}	
	}

	//method for chaining - used recursively
	/* object in chain list:
	 * carrierID (-1 for floor/falls with linear paths)
	 * roamerID (or gadgetID. dominoes "travel" along a path like a roamer does)
	 * outface (inface should be equal to previous element's outface)
	 * Use array to hold: [carrierID, roamerID, outface]
	 * 
	 * CarrierID:
	 * -1 => Linear paths along inert objects or ground
	 * -2 => Free fall.
	 * 
	 * Assumes that roamers are 1 block. (probably needs extending)
	 */
	var GetNextEntry = function(chainEntry, roamerID) {
		var outface = chainEntry[2];
		var position = GetPositionFromFace(outface);
		var thisID = GetObjectFromGrid(position);
		var direction = outface[3];
		var nextPos = GetNextBlock(position,direction);
		var nextID = GetObjectFromGrid(nextPos);
		var nextObj = objectSceneIDList[nextID];

		// Check bounds.
		if (!isWithinLimits(nextPos,direction)) return null;
		// Check if landed on top of inert.
		if (direction == 4 && nextObj.category == "inert") return null;

		// If next block contains object:
		if (nextObj != null) {
			// If next object is roamer/gadget:
			if (nextObj.category === "roamer") {
				// If roamer, outface is as far as it can go on ground 
				// (up to GRID_WIDTH)
				if (OnGroundOrInert(nextPos)) {
					while (OnGroundOrInert(nextPos) 
						   && isWithinLimits(nextPos,direction)) {
						position = nextPos;
						nextPos = GetNextBlock(position,direction);
					}
					return createChainEntry(-1, nextID, 
											GetOutface(position,direction));	
				}
			} 
			// If gadget, outface is the one corresponding to inface
			else if (nextObj.category === "gadget") {
				// TODO: Get inface, use it to get outface. Send gadget sceneID.
			}
			// If next object is an inert:
			// TODO: Bounce back.
			// If next object is a carrier.
			// TODO: If inface, then get outface. Else, bouce back.
		} 
		// Next position is empty:
		else {
			// TODO: Check below for carriers/freefall.
			console.log("Position empty.");
			var belowPos = GetNextBlock(nextPos,4);

			var belowNextID = GetObjectFromGrid(belowPos);
			nextObj = objectSceneIDList[belowNextID];
			// If object below
			if (nextObj != null) {
				console.log("Found object below: " + nextObj.name);
				if (nextObj.category === "carrier") {
					var inface = getInface(nextPos,getOppositeDirection(direction));
					// If outface matches an inface.
					if (nextObj.hasInFace(GetRelativeFace(inface,
						nextObj.position))) {
						var outface = 
							GetAbsoluteFace(nextObj.getOutFace(inface),
								nextObj.position);
						return createChainEntry(belowNextID,roamerID,outface);
					} else return null;
						
				}
			}
			// Free fall
			else {
				console.log("Nothing below => Free fall.");
				while (belowPos[2] > 0 && belowNextID == null) {
					nextPos = belowPos;
					belowPos = GetNextBlock(belowPos,4);
					belowNextID = GetObjectFromGrid(belowPos);
				}
				if (belowNextID == null)
					nextPos = belowPos;
				var outface = GetOutface(nextPos,4);
				return createChainEntry(-2,roamerID,outface);
			}
		}	
		return null;
	}

	// Continue to chain. Recursive.
	var GetNextChainLink = function(listNum,index,roamerID){
		var nextEntry = GetNextEntry(startingObjectList[listNum][index],roamerID);
		startingObjectList[listNum][index + 1] = nextEntry;

		// TODO: Recurse after GetNextEntry is completed.
		console.log("ADDED ENTRY: " + startingObjectList[listNum][index+1]);
		console.log("");
		if (nextEntry != null) 
			GetNextChainLink(listNum,startingObjectList[listNum].length-1,
				startingObjectList[listNum][index+1][1]);
	};

	// Position after starter must contain a roamer or gadget.
	var getFirstRoamer = function(listNum) {
		var chainEntry = startingObjectList[listNum][0];
		var outface = chainEntry[2];
		var direction = outface[3];
		var position = GetPositionFromFace(outface);
		var next = GetNextBlock(position,direction);
		var nextID = GetObjectFromGrid(next);	

		if (!isUndefined(objectSceneIDList[nextID])) {
			var nextCategory = objectSceneIDList[nextID].category;
			if (nextCategory === "roamer" || nextCategory === "gadget") {
				console.log("next is a " + nextCategory);
				return nextID;
			}
		} else {
			console.log("no next roamer/gadget.");
			return null;
		}
	}

	//method to create chains for run mode
	this.CreateChains = function(){
		for (var i = 0; i < startingObjectCounter; i++)
		{
			var firstID = getFirstRoamer(i);
			if (firstID != null) 
				GetNextChainLink(i,0,firstID);
			else startingObjectList[i][1] = null;
		}
	};

	var isUndefined = function(obj) {
		return (typeof obj === "undefined")
	}

	/*-----------------Animation code-----------------*/

	var currentHardcodedNumberForRendering = 60;
	var stateList = new Array();

	 /* start: midpoint of inblock
	  * endface: the one midpoint of outface's inblock
	  *
	  * facenums (
	  * looking down from z:
	  * y |  +-0-+
	  *   | 3|   |1
	  *   |  +-2-+
	  * --+-------------
	  *   |  x
	  *
	  * looking from -y:
	  * z |  +-5-+
	  *   |  |   |
	  *   |  +-4-+
	  * --+-------------
	  *   |  x
	  */

	var InblockForOutface = function(outface){
		switch(outface[3]){
			case 0: return [outface[0], outface[1] + 1, outface[2]];
			case 1: return [outface[0] + 1, outface[1], outface[2]];
			case 2: return [outface[0], outface[1] - 1, outface[2]];
			case 3: return [outface[0] - 1, outface[1], outface[2]];
			case 4: return [outface[0], outface[1], outface[2] - 1];
			case 5: return [outface[0], outface[1] + 1, outface[2]];
			default : return false;
		}
	};

	//initiate states for all starting points. Chains have to be created already.
	this.InitiateAnimation = function(){
		for (var i = 0; i < startingObjectCounter; i++){
				stateList[i] = new Object();
				// Chain entry: [carrier, roamer, outface]
				// startingObjectList entry = array of chain entries
				// To get the sceneID in the chain entry, 
				// you need startingObjectList[i][0][0] (carrier)
				// or startingObjectList[i][0][1] (roamer)
				// startingObjectList[i][0] refers to a chain entry, 
				// which is [carrierID,roamerID,face]
				// IDs used are scene IDs. To get the objectID, 
				// use objectSceneIDList[carrierID].
				stateList[i].currentCarrier = startingObjectList[i][1][0]; 
				stateList[i].currentRoamer = startingObjectList[i][1][1];

				//objectSceneIDList[startingObjectList[i][0][0]].momentum
				//for now, have a random val
				stateList[i].momentum = 12;
				
				// in momentum = mv = mass * v; thus v = momentum/mass
				// d = new.outface's block - prev.outface's block 
				// increment = d/total time
				// v * tt = inc * refreshes made
				// assume refreshes mad/tt = framerate 
				//				= currentHardcodedNumberForRendering = v/inc
				// we can get get inc = v/currentHardcodedNumberForRendering 
				//		= (momentum/mass)/currentHardcodedNumberForRendering
				// numIncs = d/inc 

				//translate prev outface to in face, and retrieve block
				var fromBlock = InblockForOutface( startingObjectList[i][0][2] );
				var toBlock = InblockForOutface( startingObjectList[i][1][2] );

				//calculate distance between in face and next outface's in block
				var xDiff = toBlock[0] - fromBlock[0];
				var yDiff = toBlock[1] - fromBlock[1];
				var zDiff = toBlock[2] - fromBlock[2];
				var absDiff = Math.sqrt( xDiff*xDiff + yDiff*yDiff + zDiff*zDiff);

				//xyz should be calculated seperately but fffffff I'll do it later 

				var inc = stateList[i].momentum/ 
						objectSceneIDList[ stateList[i].currentRoamer ].mass/
						currentHardcodedNumberForRendering;

				console.log("Inc is : "
					+ stateList[i].momentum
					+ "/" + objectSceneIDList[ stateList[i].currentRoamer ].mass 
					+ "/" + currentHardcodedNumberForRendering
					+ "; = " + inc
					);

				stateList[i].xInc = inc * xDiff / absDiff;
				stateList[i].yInc = inc * yDiff / absDiff;
				stateList[i].zInc = inc * zDiff / absDiff;			
				
				stateList[i].stepsLeft = absDiff / inc;
				stateList[i].currChainPosition = 0;
				console.log("Steps Left : " + stateList[i].stepsLeft);
		}
	};

	// returns true while still animating
	// when done, return false
	this.UpdateAnimation = function(){
		//to check if all chains are done
		var numChainsRunning = startingObjectCounter;

		for (var i = 0; i < startingObjectCounter; i ++ ){
			if (stateList[i] == null) numChainsRunning -- ;
			else if (stateList[i].stepsLeft > 1 ){
				// updating objects in scene requires : ID, delta

				/*+++++ EMILY PSEUDO-FUNCTION ALERT. BEEP BEEP BEEP +++++*/
				//UpdateObjectInScene(stateList[i].currentRoamer, 
				//	stateList[i].xInc, stateList[i].yInc, stateList[i].zInc);

				console.log("only update pos");
				stateList[i].stepsLeft -- ;

			} else if (startingObjectList[i][stateList[i].currChainPosition + 1]
																		!= null) {

				stateList[i].currentCarrier = startingObjectList[i]
												[stateList[i].currChainPosition + 1]
												[0]; 
				stateList[i].currentRoamer = startingObjectList[i]
												[stateList[i].currChainPosition + 1]
												[1];
				console.log("current chain position = " 
					+ [stateList[i].currChainPosition]);
				var fromBlock = InblockForOutface( startingObjectList[i]
											[stateList[i].currChainPosition][2] );
				
				// TODO : update object position to fromblock
				/*+++++ EMILY PSEUDO-FUNCTION ALERT. BEEP BEEP BEEP +++++*/
				//UpdateObjectInScene(stateList[i].currentRoamer, 
				//	fromBlock[0], fromBlock[1], fromBlock[2]);
				
				var toBlock = InblockForOutface( startingObjectList[i]
												[stateList[i].currChainPosition + 1]
												[2] );

				//calculate distance between in face and next outface's in block
				var xDiff = toBlock[0] - fromBlock[0];
				var yDiff = toBlock[1] - fromBlock[1];
				var zDiff = toBlock[2] - fromBlock[2];
				var absDiff = Math.sqrt( xDiff*xDiff + yDiff*yDiff + zDiff*zDiff);

				//xyz should be calculated seperately but fffffff I'll do it later 

				var inc = stateList[i].momentum/ 
						objectSceneIDList[ stateList[i].currentRoamer ].mass/
						currentHardcodedNumberForRendering;

				stateList[i].xInc = inc * xDiff / absDiff;
				stateList[i].yInc = inc * yDiff / absDiff;
				stateList[i].zInc = inc * zDiff / absDiff;			
				
				stateList[i].stepsLeft = absDiff / inc;
				stateList[i].currChainPosition ++ ;

				console.log("new xInc : " + stateList[i].xInc);
				console.log("new yInc : " + stateList[i].yInc);
				console.log("new zInc : " + stateList[i].zInc);

			} else {
				stateList[i] = null;
				
			}
			if (stateList[i]){
				console.log("Updated state:");
				console.log("Steps Left : " + stateList[i].stepsLeft);
			} else console.log("terminated chain");
		}

		if (numChainsRunning != 0) return true;
		else return false;
	};


  	/*-----------------For testing purposes-----------------*/
  	this.PrintAllObjects = function(){
  		for (var i = 0; i <objectSceneIDCounter; i++)
  		{
  			console.log("Object " + i + " is a(n) " + objectSceneIDList[i].name );
  		} 
  		console.log("Total of " + objectSceneIDCounter + " objects.");
  	};

  	this.PrintAllStartingObjects = function(){
  		for (var i = 0; i <startingObjectCounter; i++)
  		{
  			var sceneObject = objectSceneIDList[startingObjectList[i][0][1]];
  			console.log("Starting Object " + i + " is a(n) " + sceneObject.name 
  							+ "; position: " + sceneObject.position);
  		} 
  	};

  	this.PrintGrid = function() {
  		for (var x = 0; x < mainGrid.length; x++) {
  			for (var y = 0; y < mainGrid[x].length; y++) {
  				for (var z = 0; z < mainGrid[x][y].length; z++) {
  					if (mainGrid[x][y][z] != null)
  						console.log("Found object at " + x + "," + y + "," + z 
  							+ ", is a " 
  							+ objectSceneIDList[mainGrid[x][y][z]].name);
  				}
  			}
  		}
  	}

  	this.PrintAllChains = function(){
  		for (var i = 0; i <startingObjectCounter; i++)
  		{
  			console.log("Chain " + i);
  			console.log("Starting Object " + i + " is a(n) " 
  							+ startingObjectList[i][0].name );
  			for (var k = 1, len = startingObjectList[i].len; k < len; k++ )
  			{
  				console.log("The " + k + "th object is a(n) " 
  								+ startingObjectList[i][k].name );
  			}
  		} 
  	};
}

