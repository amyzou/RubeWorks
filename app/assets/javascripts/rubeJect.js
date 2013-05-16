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

function RubeJect(objectID, name, type){
		this.position = new Array(0, 0, 0);
		this.ID = objectID;
		this.type = type;
		this.rotation = 0;
		this.name = name;
		this.numBlocks = 0;
		this.blockList = new Array();
		this.mass = 0;
		
		//Index of inFace correlates to outFace.
		this.inFaces = new Array();
		this.outFace = new Array();

		this.GetOutFace = function(inFace){
			// To do: Check for out of array index.
			return outFace[inFace];
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