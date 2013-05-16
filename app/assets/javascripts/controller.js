 /* contoller creates linked list by:
  * objectID
  * 
  * while making list, needs to check for :
  * object type
  * 
  * when animating, keeps running object state
  */

  /*----------Main RubJect Controller Class-----------------*/
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

	var objectList = new Array();
	var objectCounter = 0;
	var startingObjectList = new Array();
	var startingObjectCounter = 0;
	
	//todo: finish 3d gridspace tracking
	var objectGrid = new Array();
	objectGrid[0] = new Array();

	//method to add object
	this.AddObject = function(RubeJect, IsStartingObject){
		this.objectList[objectCounter] = RubeJect;
		//occupy space here

		if (IsStartingObject) 
		{
			startingObjectList[startingObjectCounter] = new Array();
			startingObjectList[startingObjectCounter][0] = objectCounter;
		}
		objectCounter ++;
	};

	//method for chaining - used recursively
	var CreateChainLink = function(list, currPosInList){
		//obtain outface
		//obtain infaces of objects next to outface
		//match up, put down link, and call create chain on the next object
		//if none, free fall to last place
	};

	//method to create chains in run mode
	this.CreateChains = function(){
		for (var i = 0; i <= startingObjectCounter; i++)
		{
			CreateChainLink(startingObjectList[i], 0);
		}
	};

  /*----------For testing purposes-----------------*/
  	this.PrintAllObjects = function(){

  	};

  	this.PrintAllStartingObjects = function(){

  	};

}

