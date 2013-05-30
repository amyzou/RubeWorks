function MouseHandler ( ) {
	mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
}

MouseHandler.prototype.move = function( event ) {
	var container_x = event.pageX - $('#grid_container').offset().left;
	var container_y = event.pageY - $('#grid_container').offset().top;
	if (container_x >= 0 && container_x <= canvas_width && 
		container_y >= 0 && container_y <= canvas_height  ) {
		event.preventDefault;
		mouse2D.x = ( container_x / canvas_width) * 2 - 1;
		mouse2D.y = - ( container_y / canvas_height ) * 2 + 1;
		return false;
	}
	return true;
}

MouseHandler.prototype.down = function( event ) {
	event.preventDefault();
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		intersector = getRealIntersector( intersects );
		if ( keyeventhandler.ctrlDown && intersector.object != plane ) {
			scene.remove( intersector.object );
		} else {
			addObjectToScene ( intersector, intersects );
		}
	}
}

