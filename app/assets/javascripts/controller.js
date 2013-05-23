 /* mainGrid
  * 
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
		for (var i = 1, len = objectSceneIDList.len; i < len; i++ ){
			mainGrid[objectSceneIDList[i][0]] 
					[objectSceneIDList[i][1]] 
					[objectSceneIDList[i][2]] = sceneID;
		}
	}

	var RemoveObjectFromSpace = function(sceneID){
		//delete object from space grid
		for (var i = 1, len = objectSceneIDList.len; i < len; i++ ){
			mainGrid[objectSceneIDList[i][0]] 
					[objectSceneIDList[i][1]] 
					[objectSceneIDList[i][2]] = null;
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
		//todo: add null checks everywhere for if an object is deleted
		RemoveObjectFromSpace(sceneID);
	}

	this.ModifyObject_Move = function(sceneID, newLocation){
		//todo
		RemoveObjectFromSpace(sceneID);
	}

	this.ModifyObject_Rotate = function(sceneID, newRotation){
		//todo
		RemoveObjectFromSpace(sceneID);
		//ask to rotate
		
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

