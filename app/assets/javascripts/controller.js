 /* 
  * the way face works:
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
	1. Add starting objects with the method; this puts the starting objects on a list
		so we keep track of starting points. What we 
	2. When the person switches to run mode, iterate through all starting objects,
		create chain for all, append freefalls when needed in this stage
		//Todo: a function that adds freefall onto things if applicable
  //todo: make lazy updates: only update runlist when there are changes between now and then
  */

// Testing: create the below thing and get chaining working.
/*  z 
	|=> O  _ 
	|  |_||_| ramp
	|  |_||_||_||_|
	|--|--|--|--|--|- x
*/
var controller = new RubeJectController();

// Instantiate objects needed.
var blocks = new Array();
blocks.push(new RubeJect(1,[1,0,0],0)); blocks.push(new RubeJect(1,[1,0,1],0)); 
blocks.push(new RubeJect(1,[2,0,0],0)); blocks.push(new RubeJect(1,[2,0,1],0)); 
blocks.push(new RubeJect(1,[3,0,0],0)); blocks.push(new RubeJect(1,[4,0,0],0));
var arrow = new RubeJect(7,[0,0,2],0);
var sphere = new RubeJect(5,[1,0,3],0);
var ramp = new RubeJect(4,[3,0,1],0);

// Add all objects to controller.
for (var i = 0; i < blocks.length; i++) {controller.AddObject(blocks[i], false);}
controller.AddObject(arrow,true); controller.AddObject(sphere,false); controller.AddObject(ramp,false);
//controller.PrintAllObjects();
controller.PrintAllStartingObjects();
//controller.PrintGrid();

// Test chaining
controller.CreateChains();

function RubeJectController(){

	/*-----------------Basic functionality-----------------*/

	var objectSceneIDList = new Array();
	var objectSceneIDCounter = 0;
	var startingObjectList = new Array();
	var startingObjectCounter = 0;
	var mainGrid = new Array();
	mainGrid[0] = new Array();
	mainGrid[0][0] = new Array();
	var xMax = 0;
	var yMax = 0;
	
	
	var PlaceObjectIntoSpace = function(sceneID){
		var blockList = objectSceneIDList[sceneID].blockList;
		var position  = objectSceneIDList[sceneID].position;
		// Iterate through blockList to add all blocks
		for (var i = 0; i < blockList.length; i++ ){
			// Absolute positions of blocks
			var x = blockList[i][0] + position[0],
			    y = blockList[i][1] + position[1],
			    z = blockList[i][2] + position[2];

			// Initiate arrays if not initiated. 
			InitiateArrays(x,y);
			console.log("Added: " + x + y + z);
			// Set sceneID in grid.
			mainGrid[x][y][z] = sceneID;
		}
	}

	var InitiateArrays = function(x,y) {
		// If grid hasn't been initiated up to this value of x
		if (x > xMax) {
			// Initiate to new x.
			for (var i = xMax + 1; i <= x; i++) {
				mainGrid[i] = new Array();
				// Initiate y array for each new x up to current max y.
				for (var j = 0; j <= yMax; j++) {
					mainGrid[i][j] = new Array();
				}
			}
			xMax = x;
		} else {
			// Initiate up to new y for all x.
			if (y > yMax) {
				for (var i = 0; i <= xMax; i++) {
					for (var j = yMax + 1; j <= y; j++) {
						mainGrid[i][j] = new Array();
					}	
				}
				yMax = y;
			}
		}
	}

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

	var translateOutface = function(outface, position) {
		outface[0] += position[0];
		outface[1] += position[1];
		outface[2] += position[2];
		return outface;
	}

	//method to add object
	this.AddObject = function(rubeJect, isStartingObject){
		//console.log("Adding: " + rubeJect.position + ";" + objectSceneIDCounter);
		objectSceneIDList[objectSceneIDCounter] = rubeJect;
		PlaceObjectIntoSpace(objectSceneIDCounter);
		if (isStartingObject) {
			var outface = translateOutface(rubeJect.getOutFaceByIndex(0), rubeJect.position);
			startingObjectList[startingObjectCounter] = createChainEntry(-1, objectSceneIDCounter, outface);
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

	// I don't think this should be the controller's job, since controller is only accessed 
	// when placing objects, and rotations happen before that.
	this.ModifyObject_Rotate = function(sceneID, newRotation){
		//todo
		RemoveObjectFromSpace(sceneID);
		//ask to rotate
	}

	//quick method to see if the faces are the same
	var IsSameFace = function(faceA, faceB){
		switch(faceA[3]){
			case 0:
				if (faceA[0] == faceB[0] 
			  		&& faceA[2] == faceB[2]
			  		&& (faceA[1] + 1 == faceB[1])
			  		&& faceB[3] == 2) return true;
			  	else return false;
			    break;
			case 1:
				if (faceA[1] == faceB[1] 
					&& faceA[2] == faceB[2] 
					&& (faceA[0] + 1 == faceB[0]) 
					&& faceB[3] == 3) return true;
				else return false;
			    break;
			case 2:
			  	if (faceA[0] == faceB[0] 
			  		&& faceA[2] == faceB[2]
			  		&& (faceA[1] == faceB[1] + 1)
			  		&& faceB[3] == 0) return true;
			  	else return false;
			    break;
			case 3:
			  	if (faceA[1] == faceB[1] 
				  	&& faceA[2] == faceB[2]
			  		&& (faceA[0] == faceB[0] + 1)
			  		&& faceB[3] == 1) return true;
			  	else return false;
			    break;
			case 4:
			  	if (faceA[0] == faceB[0] 
			  		&& faceA[1] == faceB[1]
			  		&& faceA[2] == faceB[2] + 1
			  		&& faceB[3] == 5) return true;
			  	else return false;
			    break;
			case 5:
			  	if (faceA[0] == faceB[0] 
			  		&& faceA[1] == faceB[1]
			  		&& faceA[2] + 1 == faceB[2]
			  		&& faceB[3] == 4) return true;
			  	else return false;
			    break;
			default: return false;
		}
	}
  
	// Retrive next block from outface.
	var GetNextBlock = function(face){
		switch(face[3]){
			case 0:	face[1] += 1; break;
			case 1: face[0] += 1; break;
			case 2:	face[1] -= 1; break;
			case 3:	face[0] -= 1; break;
			case 4:	face[2] -= 1; break;
			case 5:	face[2] += 1; break;
		}
		return GetPositionFromOutface(face);
	}


	var GetPositionFromOutface = function(face) {
		return face.slice(0,3);
	}

	//method for chaining - used recursively
	/* object in chain list:
	 * carrierID (-1 for floor/falls with linear paths)
	 * roamerID (or gadgetID. dominoes "travel" along a path the way a roamer does)
	 * outface (inface should be equal to previous element's outface)

	 * Use array to hold: [carrierID, roamerID, outface]
	 */

	var CreateChainLink = function(num){
		var chainEntry = startingObjectList[num];
		// obtain outface
		//console.log("chain entry: " + chainEntry);
		var outface = chainEntry[2];
		var face = outface[3];
		// obtain position from outface
		var position = GetPositionFromOutface(outface);
		//console.log("outface position: " + position);
		var next = GetNextBlock(outface,position);
		//console.log("next position: " + position);
		//obtain infaces of objects next to outface
		//if (grid[next[0]][next[1]][next[2]])
		//match up, put down link, and call create chain on the next object
		//if none, free fall to last place
	};

	//method to create chains for run mode
	this.CreateChains = function(){
		for (var i = 0; i < startingObjectCounter; i++)
		{
			CreateChainLink(0);
		}
	};

	/*-----------------Animation code-----------------*/

	//updating objects in scene required : ID, absoluteposition

	var stateList = new Array();

	//initiate states for all starting points; first create chains though.
	this.InitiateAnimation = function(){
		for (var i = 0; i < startingObjectCounter; i++){
				stateList[i] = new Object();
				stateList[i].currentCarrier = startingObjectList[i][0]; //objectID
				stateList[i].currentRoamer;
				stateList[i].path;//this is an array
				stateList[i].currPosition = 0; //this is which position it is using right now
		}
	};

	this.CalculatePath = function(objectID, inface){
		//calculate path: interpolate and store results in a list
		//return array of positions
	};

	/*
	this.UpdateAnimation = function(){
		update state
			for each state:
				if   last position in path, 
					if mv != 0
		move to the next object, 
		calculate path for new object, 
		change current carrier to new object
		else delete state from state list or something
				else  move current position to the next position in path
	};
*/

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
  			var sceneObject = objectSceneIDList[startingObjectList[i][1]];
  			console.log("Starting Object " + i + " is a(n) " + sceneObject.name + "; position: " + sceneObject.position);
  		} 
  	};

  	this.PrintGrid = function() {
  		for (var x = 0; x < mainGrid.length; x++) {
  			for (var y = 0; y < mainGrid[x].length; y++) {
  				for (var z = 0; z < mainGrid[x][y].length; z++) {
  					if (mainGrid[x][y][z] != null)
  						console.log("Found object at " + x + "," + y + "," + z + ", is a " + objectSceneIDList[mainGrid[x][y][z]].name);
  				}
  			}
  		}
  	}

  	this.PrintAllChains = function(){
  		for (var i = 0; i <startingObjectCounter; i++)
  		{
  			console.log("Chain " + i);
  			console.log("Starting Object " + i + " is a(n) " + startingObjectList[i][0].name );
  			for (var k = 1, len = startingObjectList[i].len; k < len; k++ )
  			{
  				console.log("The " + k + "th object is a(n) " + startingObjectList[i][k].name );
  			}
  		} 
  	};
}

