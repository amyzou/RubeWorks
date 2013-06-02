function onKeyDown ( event ) {
	switch( event.keyCode ) {
		case 16: shiftDown = true; break;
		case 17: ctrlDown = true; break;
	}
}

function onKeyUp ( event ) {
	switch ( event.keyCode ) {
		case 16: shiftDown = false; break;
		case 17: ctrlDown = false; break;
		case 82: rotateCurrentObject(); break;	//rotate
	}
}

function onMouseMove ( event ) {
	if (!buildMode) return true;
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

function onMouseDown ( event ) {
	if (!buildMode) return true;
	event.preventDefault();
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		intersector = getRealIntersector( intersects );
		if ( ctrlDown && intersector.object != plane ) {
			removeObjectFromScene( intersector.object  );
		} else {
			addObjectToScene ( intersector, intersects );
		}
	}
}