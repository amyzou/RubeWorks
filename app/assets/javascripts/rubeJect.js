/* Defining blocks (when asked for block list)
 * we follow (x, y, z)
 *
 * Defining faces
 * (BlockPos, facenum)
 */

/* BlockPos
 * (x, y, z)
 */

//2x the minimum frame rate before lag?
var OBJECT_FRAME_RATE = 48;

function RubeJect(objectPropertyID){
	//populate the object variables with stuff from database
	//objects are stored with object property ID
/*
category:'inert', 
	image_file: 'block.png', 
	obj_file: 'null', 
	texture_file: 'null', 
	block_num: 1, 
	blocks: '1'
	*/
		this.categoryType;
		this.rotation;
		this.blockList = new Array();
		this.mass = 0;
		
		//inFace correlates to outFace.
		var IOMap = {};
	//populate map like dis:
/*
	a["key1"] = "value1";
	a["key2"] = "value2";
*/

		this.DoesInFaceExist = function(inFace){
			if ("inFace" in IOMap) return true;
			else return false;
		};

		this.GetOutFace = function(inFace){
			// To do: Check for out of array index.
			//TODO: transform inface to inface ID
			return IOMap["inFace"];
		};

		this.velocityToFrameRateRatio = 1.0;
		this.changeInHeight = 0;
		this.Rotate = function(){
			this.rotation = (this.rotation + 1) % 4;
			//To do, modify block list?
		};
		this.GetBlockList = function(){
			//To do: maybe just modify block list here?
			return this.blockList;
		};
}

/*----------Inert Object Class-----------------*/
function InertRubeJect(objectID, name, type){
	this.elasticity = 1.0;
}

//InertRubeJect can make function calls to any RubeJect functions

/* NOTE: Currently using standard inheritance atm, but we may want
 * to consider parasitic inheritance.  Seen here: 
 * http://www.crockford.com/javascript/inheritance.html.
 *
 */
InertRubeJect.inherits(RubeJect);

/*---------------------------------------------*/

/*----------Gadget Object Class----------------*/
function GadgetRubeJect(objectID, name, type){
	/* Key Frames for gadget */
	this.keyFrames = new Array();
}

GadgetRubeJect.inherits(RubeJect);

/*---------------------------------------------*/

/*------------Roamer Object Class--------------*/
function RoamerRubeJect(objectID, name, type){
	//For now, empty, since Roamer has no unique
	//properties...
}

RoamerRubeJect.inherits(RubeJect);

/*---------------------------------------------*/

/*-------------Carrier Object Class------------*/
function CarrierRubeJect(ID, name, type){
	/* Should each instance get its own array?
	 * Maybe we can have a singleton access to the array?
	 */
	this.compatibleRoamers = new Array();
	this.roamerPositionNodes = new Array();

	/* Returns the position of where the roamer object should be.
	*/
	this.AnimateCarrierPosition = function(positionNodeIndex, interpolation){
		/*
		 * To do: Fill in this function.
		 */
	}
}

CarrierRubeJect.inherits(RubeJect);
/*---------------------------------------------*/

var pyramid = new InertRubeJect(0, "Pyramid", "Inert");
pyramid.blockList.push([0, 0, 0]);
 pyramid.blockList.push([1, 0, 0]);
 pyramid.blockList.push([2, 0, 0]);
 pyramid.blockList.push([3, 0, 0]);
 pyramid.blockList.push([4, 0, 0]);
 pyramid.blockList.push([5, 0, 0]);
 pyramid.blockList.push([6, 0, 0]);
 pyramid.blockList.push([7, 0, 0]);
 pyramid.blockList.push([8, 0, 0]);
 
pyramid.blockList.push([0, 1, 0]);
 pyramid.blockList.push([1, 1, 0]);
 pyramid.blockList.push([2, 1, 0]);
 pyramid.blockList.push([3, 1, 0]);
 pyramid.blockList.push([4, 1, 0]);
 pyramid.blockList.push([5, 1, 0]);
 pyramid.blockList.push([6, 1, 0]);
 pyramid.blockList.push([7, 1, 0]);
 pyramid.blockList.push([8, 1, 0]);

pyramid.blockList.push([0, 2, 0]);
 pyramid.blockList.push([1, 2, 0]);
 pyramid.blockList.push([2, 2, 0]);
 pyramid.blockList.push([3, 2, 0]);
 pyramid.blockList.push([4, 2, 0]);
 pyramid.blockList.push([5, 2, 0]);
 pyramid.blockList.push([6, 2, 0]);
 pyramid.blockList.push([7, 2, 0]);
 pyramid.blockList.push([8, 2, 0]);
 
pyramid.blockList.push([0, 3, 0]);
 pyramid.blockList.push([1, 3, 0]);
 pyramid.blockList.push([2, 3, 0]);
 pyramid.blockList.push([3, 3, 0]);
 pyramid.blockList.push([4, 3, 0]);
 pyramid.blockList.push([5, 3, 0]);
 pyramid.blockList.push([6, 3, 0]);
 pyramid.blockList.push([7, 3, 0]);
 pyramid.blockList.push([8, 3, 0]);

pyramid.blockList.push([0, 4, 0]);
 pyramid.blockList.push([1, 4, 0]);
 pyramid.blockList.push([2, 4, 0]);
 pyramid.blockList.push([3, 4, 0]);
 pyramid.blockList.push([4, 4, 0]);
 pyramid.blockList.push([5, 4, 0]);
 pyramid.blockList.push([6, 4, 0]);
 pyramid.blockList.push([7, 4, 0]);
 pyramid.blockList.push([8, 4, 0]);
 
pyramid.blockList.push([0, 5, 0]);
 pyramid.blockList.push([1, 5, 0]);
 pyramid.blockList.push([2, 5, 0]);
 pyramid.blockList.push([3, 5, 0]);
 pyramid.blockList.push([4, 5, 0]);
 pyramid.blockList.push([5, 5, 0]);
 pyramid.blockList.push([6, 5, 0]);
 pyramid.blockList.push([7, 5, 0]);
 pyramid.blockList.push([8, 5, 0]);
 
pyramid.blockList.push([0, 6, 0]);
 pyramid.blockList.push([1, 6, 0]);
 pyramid.blockList.push([2, 6, 0]);
 pyramid.blockList.push([3, 6, 0]);
 pyramid.blockList.push([4, 6, 0]);
 pyramid.blockList.push([5, 6, 0]);
 pyramid.blockList.push([6, 6, 0]);
 pyramid.blockList.push([7, 6, 0]);
 pyramid.blockList.push([8, 6, 0]);
 
pyramid.blockList.push([0, 7, 0]);
 pyramid.blockList.push([1, 7, 0]);
 pyramid.blockList.push([2, 7, 0]);
 pyramid.blockList.push([3, 7, 0]);
 pyramid.blockList.push([4, 7, 0]);
 pyramid.blockList.push([5, 7, 0]);
 pyramid.blockList.push([6, 7, 0]);
 pyramid.blockList.push([7, 7, 0]);
 pyramid.blockList.push([8, 7, 0]);
 
pyramid.blockList.push([0, 8, 0]);
 pyramid.blockList.push([1, 8, 0]);
 pyramid.blockList.push([2, 8, 0]);
 pyramid.blockList.push([3, 8, 0]);
 pyramid.blockList.push([4, 8, 0]);
 pyramid.blockList.push([5, 8, 0]);
 pyramid.blockList.push([6, 8, 0]);
 pyramid.blockList.push([7, 8, 0]);
 pyramid.blockList.push([8, 8, 0]);
 
pyramid.blockList.push([1, 1, 1]);
 pyramid.blockList.push([2, 1, 1]);
 pyramid.blockList.push([3, 1, 1]);
 pyramid.blockList.push([4, 1, 1]);
 pyramid.blockList.push([5, 1, 1]);
 pyramid.blockList.push([6, 1, 1]);
 pyramid.blockList.push([7, 1, 1]);
 
pyramid.blockList.push([1, 2, 1]);
 pyramid.blockList.push([2, 2, 1]);
 pyramid.blockList.push([3, 2, 1]);
 pyramid.blockList.push([4, 2, 1]);
 pyramid.blockList.push([5, 2, 1]);
 pyramid.blockList.push([6, 2, 1]);
 pyramid.blockList.push([7, 2, 1]);

pyramid.blockList.push([1, 3, 1]);
 pyramid.blockList.push([2, 3, 1]);
 pyramid.blockList.push([3, 3, 1]);
 pyramid.blockList.push([4, 3, 1]);
 pyramid.blockList.push([5, 3, 1]);
 pyramid.blockList.push([6, 3, 1]);
 pyramid.blockList.push([7, 3, 1]);

pyramid.blockList.push([1, 4, 1]);
 pyramid.blockList.push([2, 4, 1]);
 pyramid.blockList.push([3, 4, 1]);
 pyramid.blockList.push([4, 4, 1]);
 pyramid.blockList.push([5, 4, 1]);
 pyramid.blockList.push([6, 4, 1]);
 pyramid.blockList.push([7, 4, 1]);
 
pyramid.blockList.push([1, 5, 1]);
 pyramid.blockList.push([2, 5, 1]);
 pyramid.blockList.push([3, 5, 1]);
 pyramid.blockList.push([4, 5, 1]);
 pyramid.blockList.push([5, 5, 1]);
 pyramid.blockList.push([6, 5, 1]);
 pyramid.blockList.push([7, 5, 1]);
 
pyramid.blockList.push([1, 6, 1]);
 pyramid.blockList.push([2, 6, 1]);
 pyramid.blockList.push([3, 6, 1]);
 pyramid.blockList.push([4, 6, 1]);
 pyramid.blockList.push([5, 6, 1]);
 pyramid.blockList.push([6, 6, 1]);
 pyramid.blockList.push([7, 6, 1]);

pyramid.blockList.push([1, 7, 1]);
 pyramid.blockList.push([2, 7, 1]);
 pyramid.blockList.push([3, 7, 1]);
 pyramid.blockList.push([4, 7, 1]);
 pyramid.blockList.push([5, 7, 1]);
 pyramid.blockList.push([6, 7, 1]);
 pyramid.blockList.push([7, 7, 1]);

pyramid.blockList.push([2, 2, 2]);
 pyramid.blockList.push([3, 2, 2]);
 pyramid.blockList.push([4, 2, 2]);
 pyramid.blockList.push([5, 2, 2]);
 pyramid.blockList.push([6, 2, 2]);

pyramid.blockList.push([2, 3, 2]);
 pyramid.blockList.push([3, 3, 2]);
 pyramid.blockList.push([4, 3, 2]);
 pyramid.blockList.push([5, 3, 2]);
 pyramid.blockList.push([6, 3, 2]);

pyramid.blockList.push([2, 4, 2]);
 pyramid.blockList.push([3, 4, 2]);
 pyramid.blockList.push([4, 4, 2]);
 pyramid.blockList.push([5, 4, 2]);
 pyramid.blockList.push([6, 4, 2]);
 
pyramid.blockList.push([2, 5, 2]);
 pyramid.blockList.push([3, 5, 2]);
 pyramid.blockList.push([4, 5, 2]);
 pyramid.blockList.push([5, 5, 2]);
 pyramid.blockList.push([6, 5, 2]);
 
pyramid.blockList.push([2, 6, 2]);
 pyramid.blockList.push([3, 6, 2]);
 pyramid.blockList.push([4, 6, 2]);
 pyramid.blockList.push([5, 6, 2]);
 pyramid.blockList.push([6, 6, 2]);

pyramid.blockList.push([3, 3, 3]);
 pyramid.blockList.push([4, 3, 3]);
 pyramid.blockList.push([5, 3, 3]);

pyramid.blockList.push([3, 4, 3]);
 pyramid.blockList.push([4, 4, 3]);
 pyramid.blockList.push([5, 4, 3]);

pyramid.blockList.push([3, 5, 3]);
 pyramid.blockList.push([4, 5, 3]);
 pyramid.blockList.push([5, 5, 3]);
 
pyramid.blockList.push([4, 4, 4]);
