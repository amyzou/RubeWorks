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
	var startingObjectList = new Array();
	var startingObjectCounter = 0;
	var mainGrid;
	
	this.ReInitializeAll = function(){
		objectSceneIDList = new Array();
		startingObjectList = new Array();
		startingObjectCounter = 0;
		InitializeGrid();
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
	};
	InitializeGrid();

	var PlaceObjectIntoSpace = function(sceneID){
		var blockList = objectSceneIDList[sceneID].blockList;
		var position  = objectSceneIDList[sceneID].position;
		// Iterate through blockList to add all blocks
		for (var i = 0; i < objectSceneIDList[sceneID].blockNum; i++ ){
			// Absolute positions of blocks
			var x = blockList[i][0] + position[0],
			    y = blockList[i][1] + position[1],
			    z = blockList[i][2] + position[2];
			// Set sceneID in grid.
			mainGrid[x][y][z] = sceneID;
		}
	};

	var RemoveObjectFromSpace = function(sceneID){
		//delete object from space grid
		var blockList = objectSceneIDList[sceneID].blockList;
		var position  = objectSceneIDList[sceneID].position;
		for (var i = 0; i < blockList.length; i++ ){
			mainGrid[blockList[i][0] + position[0]] 
					[blockList[i][1] + position[1]] 
					[blockList[i][2] + position[2]] = null;
		}
	};

	var createChainEntry = function(carrierID, roamerID, outface) {
		var chainEntry = new Array();
		chainEntry[0]  = carrierID;
		chainEntry[1]  = roamerID;
		chainEntry[2]  = outface;
		return chainEntry;
	};

	var GetAbsoluteFace = function(face, position) {
		absFace = face.slice(0);
		absFace[0] += position[0];
		absFace[1] += position[1];
		absFace[2] += position[2];
		return absFace;
	};

	var GetRelativeFace = function(face, position) {
		face[0] -= position[0];
		face[1] -= position[1];
		face[2] -= position[2];
		return face;	
	};

	var ContainsObject = function(x,y,z) {
		if (mainGrid[x][y][z] != null) {
			return true;
		}
		return false;
	};

	this.CanPlaceObject = function(blockList, pos, category) {
		for (var i = 0; i < blockList.length; i++) {
			var translatedPos = pos.slice(0);
			translatedPos[0] += blockList[i][0];
			translatedPos[1] += blockList[i][1];
			translatedPos[2] += blockList[i][2];
			//console.log(translatedPos);

			if (!allWithinLimits(translatedPos)) {
				//console.log("Out of limits.");
				return false;
			} 
			if (ContainsObject(translatedPos[0], translatedPos[1], translatedPos[2])) {
				//console.log("Intersection.");
				return false;
			} 
		}
		// Roamers and gadgets must be on an inert or ground
		if (category == "roamer" || category == "gadget" || category == "carrier") {
			var groundBlocks = GetGroundBlocks(blockList, pos); 
			for (var i = 0; i < groundBlocks.length; i++) {
				if (!OnGroundOrInert(groundBlocks[i])) {
					//console.log("Floating/not on inert.");
					return false;
				}
			}
		} 
		return true;
	};

	var GetGroundBlocks = function (blockList, pos) {
		var groundBlocks = new Array();
		for (var i = 0; i < blockList.length; i++) {
			if (blockList[i][2] === 0) {
				var groundBlock = blockList[i].slice(0);
				groundBlock[0] += pos[0];
				groundBlock[1] += pos[1];
				groundBlock[2] += pos[2];
				groundBlocks.push(groundBlock);
			}
		}
		return groundBlocks;
	};


	//method to add object
	this.AddObject = function(objectPropertyID, sceneID, position, rotation){
		var positionCopy = position.slice(0);
		var rubeJect = new RubeJect(objectPropertyID, positionCopy, rotation);
		objectSceneIDList[sceneID] = rubeJect;
		PlaceObjectIntoSpace(sceneID);
		if (rubeJect.category === "starter") {
			startingObjectList[startingObjectCounter] = new Array();
			var outface = GetAbsoluteFace(rubeJect.getOutFaceByIndex(0), positionCopy);
			startingObjectList[startingObjectCounter][0] = 
				createChainEntry(-1, sceneID, outface);
			//console.log("Added entry: " + createChainEntry(-1, sceneID, outface));
			startingObjectCounter++;
		}
	};

	this.ModifyObject_Delete = function(sceneID){
		RemoveObjectFromSpace(sceneID);
		objectSceneIDList[sceneID] = null;
	};

	this.ModifyObject_Move = function(sceneID, newLocation){
		RemoveObjectFromSpace(sceneID);
		objectSceneIDList[sceneID].position = newLocation;
		PlaceObjectIntoSpace(objectSceneIDCounter);
	};

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
	};
  
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
	};

	var GetOutface = function(pos,direction) {
		var outface = pos.slice(0);
		outface[3] = direction;
		return outface;
	};

	var GetPositionFromFace = function(face) {
		return face.slice(0,3);
	};

	var GetObjectFromGrid = function(pos) {
		if (mainGrid[pos[0]][pos[1]][pos[2]] == null 
			|| isUndefined(mainGrid[pos[0]][pos[1]][pos[2]])) 
			return null;
		else return mainGrid[pos[0]][pos[1]][pos[2]];
	};

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
	};

	var allWithinLimits = function(pos) {
		for (var i = 0; i < 6; i++) {
			if (!isWithinLimits(pos,i))
				return false;
		}
		return true;
	};

	var isWithinLimits = function(pos,direction){
		switch(direction){
			case 0:	return pos[1] < GRID_SIZE;
			case 1: return pos[0] < GRID_SIZE;
			case 2:	return pos[1] >= 0;
			case 3:	return pos[0] >= 0;
			case 4:	return pos[2] >= 0;
			case 5:	return pos[2] < GRID_SIZE;
		}
	};

	var getInface = function(pos,face) {
		var inface = pos.slice(0);
		inface[3] = face;
		return inface;
	};

	var getOppositeDirection = function(direction) {
		switch(direction){
			case 0:	return 2;
			case 1: return 3;
			case 2:	return 0;
			case 3:	return 1;
			case 4:	return 5;
			case 5:	return 4;
		}	
	};

	var GetOutfaceFromObj = function(obj, inface) {
		// If outface matches an inface.
		var outface = obj.getOutFace(GetRelativeFace(inface, obj.position));
		if (outface != null) {
			return GetAbsoluteFace(obj.getOutFace(inface), obj.position);
		}
		else return null;
	};

	var GetFlatPathOutface = function(pos, dir) {
		var prevPos;
		while (OnGroundOrInert(pos)) {
			prevPos = pos;
			pos = GetNextBlock(prevPos,dir);
			if (!isWithinLimits(pos, dir)) break;
			if (GetObjectFromGrid(pos) != null) break;
		}
		return GetOutface(prevPos,dir);
	};

	var GetFreefallOutface = function(pos) {
		var belowNextID = GetObjectFromGrid(pos);
		var prevPos;
		while (pos[2] > 0 && belowNextID == null) {
			prevPos = pos;
			pos = GetNextBlock(pos,4);
			belowNextID = GetObjectFromGrid(pos);
		}
		if (belowNextID == null) return GetOutface(pos,4);
		else return GetOutface(prevPos,4);
	};

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
		//if (chainEntry == null) return null;
		var outface = chainEntry[2];
		var position = GetPositionFromFace(outface);
		var thisID = GetObjectFromGrid(position);
		var direction = outface[3];
		var nextPos = GetNextBlock(position,direction);
		// Check bounds.
		if (!isWithinLimits(nextPos,direction)) return null;
		var nextID = GetObjectFromGrid(nextPos);
		var nextObj = objectSceneIDList[nextID];
		// Check if landed on top of inert.
		if (direction == 4 && nextObj.category == "inert") return null;

		// If gadget, must contact a roamer or gadget. 
		if (objectSceneIDList[roamerID].category == "gadget") {
			if (nextObj == null) return null;
			if (nextObj.category !== "roamer" || nextObj.category !== "gadget")	return null;
		}

		// If next block contains object:
		if (nextObj != null) {
			// If roamer, outface is as far as it can go on ground 
			if (nextObj.category === "roamer") {
				//console.log("found roamer. Pos: " + position);
				if (OnGroundOrInert(nextPos)) {
					var outface = GetFlatPathOutface(nextPos,direction);
					return createChainEntry(-1, nextID, outface);	
				}
			} 
			// If gadget, outface is the one corresponding to inface
			else if (nextObj.category === "gadget") {
				//console.log("Found gadget");
				var inface = getInface(nextPos,getOppositeDirection(direction));
				var outface = GetOutfaceFromObj(nextObj,inface);
				if (outface != null)
					return createChainEntry(-1,nextID,outface);
			}
			// If carrier, travel over carrier. Outface retrieved via inface.
			else if (nextObj.category === "carrier") {
				//console.log("Found carrier");
				var inface = getInface(nextPos,getOppositeDirection(direction));
				var outface = GetOutfaceFromObj(nextObj,inface);
				if (outface != null)
					return createChainEntry(nextID,roamerID,outface);
			}
			// If inert, stop.
			else if (nextObj.category === "inert") {
				//console.log("Found inert.");
			}
		} 
		// Next position is empty:
		else {
			
			//console.log("Position empty.");
			// Check if on ground
			if (OnGroundOrInert(nextPos)) {
				var outface = GetFlatPathOutface(nextPos,direction);
				//console.log(outface);
				return createChainEntry(-1, roamerID, outface);	
			}

			// TODO: Check below for carriers/freefall.
			var belowPos = GetNextBlock(nextPos,4);
			if (!isWithinLimits(belowPos,4)) return null;
			var belowNextID = GetObjectFromGrid(belowPos);
			nextObj = objectSceneIDList[belowNextID];
			// If object below
			if (nextObj != null) {
				//console.log("Found object below: " + nextObj.name);
				if (nextObj.category === "carrier") {
					var inface = getInface(nextPos,getOppositeDirection(direction));
					var outface = GetOutfaceFromObj(nextObj,inface);
					if (outface != null) 
						return createChainEntry(belowNextID,roamerID,outface);
				}
			}
			// Free fall
			else {
				//console.log("Nothing below => Free fall.");
				var outface = GetFreefallOutface(belowPos);
				return createChainEntry(-2,roamerID,outface);
			}
		}	
		return null;
	};

	// Continue to chain. Recursive.
	var GetNextChainLink = function(listNum,index,roamerID){
		var nextEntry = GetNextEntry(startingObjectList[listNum][index],roamerID);
		//console.log("Added entry: " + nextEntry);
		startingObjectList[listNum][index + 1] = nextEntry;

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
				//console.log("next is a " + nextCategory + "; number " + nextID);
				return nextID;
			}
		} else {
			//console.log("no next roamer/gadget.");
			return null;
		}
	};

	//method to create chains for run mode
	this.CreateChains = function(){
		for (var i = 0; i < startingObjectCounter; i++)
		{
			startingObjectList[i].length = 1;
			var firstID = getFirstRoamer(i);
			if (firstID != null) 
				GetNextChainLink(i,0,firstID);
			else startingObjectList[i][1] = null;
		}
	};

	var isUndefined = function(obj) {
		return (typeof obj === "undefined")
	};

	/*-----------------Animation code-----------------*/

	var currentHardcodedNumberForRendering = 100;
	var gravityDamper = 1;
	var gravity = 9.8 / currentHardcodedNumberForRendering * gravityDamper;
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
				console.log("Initiate animation+++++++++++++++++++++++++");
				console.log("Current carrier = " + stateList[i].currentCarrier);
				console.log("Current roamer = " + stateList[i].currentRoamer);

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
				console.log("Starting from: " + fromBlock[0] 
					+ ", " + fromBlock[1] + ", " + fromBlock[2]);
				console.log("destination: " + toBlock[0] 
					+ ", " + toBlock[1] + ", " + toBlock[2]);
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
				
				console.log("xInc : " + stateList[i].xInc);
				console.log("yInc : " + stateList[i].yInc);
				console.log("zInc : " + stateList[i].zInc);
				stateList[i].stepsLeft = absDiff / inc;
				stateList[i].currChainPosition = 1;
				console.log("Steps Left : " + stateList[i].stepsLeft);
				console.log("Done initiating animation++++++++++++++++++");
		}
	};

	//adjust z for gravity
	//need to do: adjust for when going up or down
	var addGravity = function(index){
		console.log("adjusting Z: ");
					var oldInc = Math.sqrt( stateList[index].xInc*stateList[index].xInc
					 + stateList[index].yInc*stateList[index].yInc
					 + stateList[index].zInc*stateList[index].zInc);
					totInc = Math.abs(gravity * stateList[index].zInc/oldInc);
					console.log("oldInc = " + oldInc);
					console.log("totInc = " + totInc);

					console.log("OldIncs: " + stateList[index].xInc + ", "
						+ stateList[index].yInc + ", "
						+ stateList[index].zInc);

					stateList[index].xInc += totInc * stateList[index].xInc / oldInc;
					stateList[index].yInc += totInc * stateList[index].yInc / oldInc;
 					stateList[index].zInc -= Math.abs(
 						totInc * stateList[index].zInc / oldInc);
					console.log("NewIncs: " + stateList[index].xInc + ", "
						+ stateList[index].yInc + ", "
						+ stateList[index].zInc);
 					stateList[index].stepsLeft 
 						= stateList[index].stepsLeft * oldInc / (oldInc + totInc);

	}
	// returns true while still animating
	// when done, return false
	this.UpdateAnimation = function(){
		//to check if all chains are done
		var numChainsRunning = startingObjectCounter;

		for (var i = 0; i < startingObjectCounter; i ++ ){
			if (stateList[i] == null) numChainsRunning -- ;
			else if (stateList[i].stepsLeft > 1 ){

 				console.log("current roamer = " + stateList[i].currentRoamer 
					+ "; only updating pos");
				UpdateObjectInScene(stateList[i].currentRoamer, 
					stateList[i].xInc, stateList[i].yInc, stateList[i].zInc);

				stateList[i].stepsLeft -- ;

				if (stateList[i].zInc != 0 ) addGravity(i);

			} else if (startingObjectList[i][stateList[i].currChainPosition + 1]
																		!= null) {
				console.log("Updating chain position; previously "
					+ [stateList[i].currChainPosition]);
				stateList[i].currChainPosition ++ ;
				console.log("new chain position = " + stateList[i].currChainPosition);
				stateList[i].currentCarrier = startingObjectList[i]
												[stateList[i].currChainPosition]
												[0]; 
				stateList[i].currentRoamer = startingObjectList[i]
												[stateList[i].currChainPosition]
												[1];
				var fromBlock = InblockForOutface( startingObjectList[i]
											[stateList[i].currChainPosition - 1][2] );
				
				console.log("roamer = " + stateList[i].currentRoamer);
				console.log("carrier = " + stateList[i].currentCarrier);

				UpdateObjectInScene(stateList[i].currentRoamer, 
				stateList[i].xInc * stateList[i].stepsLeft,
				stateList[i].yInc * stateList[i].stepsLeft, 
				stateList[i].zInc * stateList[i].stepsLeft);
				
				var toBlock = InblockForOutface( startingObjectList[i]
												[stateList[i].currChainPosition]
												[2] );
				console.log("Starting from: " + fromBlock[0] 
					+ ", " + fromBlock[1] + ", " + fromBlock[2]);
				console.log("new destination: " + toBlock[0] 
					+ ", " + toBlock[1] + ", " + toBlock[2]);

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

				console.log("new xInc : " + stateList[i].xInc);
				console.log("new yInc : " + stateList[i].yInc);
				console.log("new zInc : " + stateList[i].zInc);


			} else {
				stateList[i] = null;
				
			}
			if (stateList[i]){
				console.log("Steps Left : " + stateList[i].stepsLeft);
			} else console.log("terminated chain");
		}

		if (numChainsRunning != 0) {
			console.log("returning true");
			return true;
		}
		else {
			console.log("returning false");
			return false;

		}
	};


  	/*-----------------For testing purposes-----------------*/
  	this.PrintAllObjects = function(){
  		for (var i = 0; i <objectSceneIDList.length; i++)
  		{
  			var sceneObject = objectSceneIDList[i];
  			if (sceneObject != null)
  				console.log("Object " + i + " is a(n) " + sceneObject.name 
  							+ ", at " + sceneObject.position);
  		} 
  	};

  	this.PrintAllStartingObjects = function(){
  		for (var i = 0; i < startingObjectList.length; i++)
  		{
  			var sceneObject = objectSceneIDList[startingObjectList[i][0][1]];
  			console.log("Starting Object " + i + " is a(n) " 
  						+ sceneObject.name + "; position: " + sceneObject.position);
  		} 
  	};

  	this.PrintGrid = function() {
  		for (var x = 0; x < mainGrid.length; x++) {
  			for (var y = 0; y < mainGrid[x].length; y++) {
  				for (var z = 0; z < mainGrid[x][y].length; z++) {
  					if (mainGrid[x][y][z] != null) {
  						//console.log(mainGrid[x][y]);
  						var sceneID = mainGrid[x][y][z];
  						var sceneObject = objectSceneIDList[sceneID];
  						console.log("Found object at " + x + "," + y + "," + z 
  							+ ", is a " + sceneObject.name
  							+ ", at " + sceneObject.position);
  					}
  				}
  			}
  		}
  	};

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

  	this.GetChains = function() {
  		return startingObjectList;
  	};
}

