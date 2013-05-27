 /* 
  * the way face works:
  * x, y, z, facenum
  * facenums (
  * looking down from z:
  * y |  +-2-+
  *   | 3|   |1
  *   |  +-0-+
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
function RubeJectController(){

	var objectSceneIDList = new Array();
	var objectSceneIDCounter = 0;
	var startingObjectList = new Array();
	var startingObjectCounter = 0;
	
	var PlaceObjectIntoSpace = function(sceneID){
		//retrieve blocklist for object and then add it
		for (var i = 1, len = blockList.len; i < len; i++ ){
			mainGrid[objectSceneIDList[sceneID].blockList[i][0] + objectSceneIDList[sceneID].position[0]] 
					[objectSceneIDList[sceneID].blockList[i][1] + objectSceneIDList[sceneID].position[1]] 
					[objectSceneIDList[sceneID].blockList[i][2] + objectSceneIDList[sceneID].position[2]] = sceneID;
		}
	}

	var RemoveObjectFromSpace = function(sceneID){
		//delete object from space grid
		for (var i = 1, len = blockList.len; i < len; i++ ){
			mainGrid[objectSceneIDList[sceneID].blockList[i][0] + objectSceneIDList[sceneID].position[0]] 
					[objectSceneIDList[sceneID].blockList[i][1] + objectSceneIDList[sceneID].position[1]] 
					[objectSceneIDList[sceneID].blockList[i][2] + objectSceneIDList[sceneID].position[2]] = null;
		}
	}

	//method to add object
	this.AddObject = function(RubeJect, IsStartingObject){
		this.objectSceneIDList[objectSceneIDCounter] = RubeJect;
		PlaceObjectIntoSpace(objectSceneIDCounter);

		if (IsStartingObject) 
		{
			startingObjectList[startingObjectCounter] = new Array();
			startingObjectList[startingObjectCounter][0] = objectSceneIDCounter;
			startingObjectCounter ++;
		}
		objectSceneIDCounter ++;
	};

	this.ModifyObject_Delete = function(sceneID){
		RemoveObjectFromSpace(sceneID);
	}

	this.ModifyObject_Move = function(sceneID, newLocation){
		RemoveObjectFromSpace(sceneID);
		objectSceneIDList[sceneID].position = newLocation;
		PlaceObjectIntoSpace(objectSceneIDCounter);
	}

	this.ModifyObject_Rotate = function(sceneID, newRotation){
		//todo
		RemoveObjectFromSpace(sceneID);
		//ask to rotate
		
	}

	var ParseFaceFromString = function(face){
		return face.split(",");
	}

	//quick method to see if the faces are the same
	var IfSameFace = function(faceA, faceB){
		faceAarray = ParseFaceFromString(faceA);
		faceBarray = ParseFaceFromString(faceB);
		if (faceAarray[2] != faceBarray[2]) return false;
		switch(faceAarray[3]){
			case 0:
			  if (faceAarray[0] == faceBarray[0] 
			  	& faceAarray[2] == faceBarray[2]
			  	& faceAarray[1] == faceBarray[1] + 1
			  	& faceAarray[3] == 2) return true;
			  	else return false;
			case 1:
			  if (faceAarray[1] == faceBarray[1] 
			  	& faceAarray[2] == faceBarray[2]
			  	& faceAarray[0] + 1 == faceBarray[0]
			  	& faceAarray[3] == 3) return true;
			  	else return false;
			case 2:
			  if (faceAarray[0] == faceBarray[0] 
			  	& faceAarray[2] == faceBarray[2]
			  	& faceAarray[1] + 1 == faceBarray[1]
			  	& faceAarray[3] == 0) return true;
			  	else return false;
			case 3:
			  if (faceAarray[1] == faceBarray[1] 
			  	& faceAarray[2] == faceBarray[2]
			  	& faceAarray[0] == faceBarray[0] + 1
			  	& faceAarray[3] == 1) return true;
			case 4:
			  if (faceAarray[0] == faceBarray[0] 
			  	& faceAarray[1] == faceBarray[1]
			  	& faceAarray[2] == faceBarray[2] + 1
			  	& faceAarray[3] == 5) return true;
			default:
			  if (faceAarray[0] == faceBarray[0] 
			  	& faceAarray[1] == faceBarray[1]
			  	& faceAarray[2] + 1 == faceBarray[2] 
			  	& faceAarray[3] == 4) return true;
		}
	}

	//method for chaining - used recursively
	var CreateChainLink = function(list, currPosInList){
		//obtain outface
		//obtain infaces of objects next to outface
		//match up, put down link, and call create chain on the next object
		//if none, free fall to last place
	};

	//method to create chains in run mode
	this.CreateChains = function(){
		for (var i = 0; i < startingObjectCounter; i++)
		{
			CreateChainLink(startingObjectList[i], 0);
		}
	};

  /*-----------------For testing purposes-----------------*/
  	this.PrintAllObjects = function(){
  		for (var i = 0; i <objectSceneIDCounter; i++)
  		{
  			console.log("Object " + i + " is a(n) " + objectSceneIDList[i].name );
  		} 
  	};

  	this.PrintAllStartingObjects = function(){
  		for (var i = 0; i <startingObjectCounter; i++)
  		{
  			console.log("Starting Object " + i + " is a(n) " + startingObjectList[i][0].name );
  		} 
  	};

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

