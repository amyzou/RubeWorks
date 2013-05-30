function KeyHandler ( ) {
	this.shiftDown = false;
	this.ctrlDown = false;
	this.rotate = false;
}

KeyHandler.prototype.press = function( event ) {
	switch( event.keyCode ) {
		case 16: this.shiftDown = true; break;
		case 17: this.ctrlDown = true; break;
	}
}

KeyHandler.prototype.release = function( event ) {
	switch ( event.keyCode ) {
		case 16: this.shiftDown = false; break;
		case 17: this.ctrlDown = false; break;
		case 82: rotateCurrentObject(); break;	//rotate
	}
}

