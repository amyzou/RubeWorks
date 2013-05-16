/**
 * HoverScroll jQuery Plugin
 *
 * Make an unordered list scrollable by hovering the mouse over it
 *
 * @author RasCarlito <carl.ogren@gmail.com>
 * @version 0.2.4
 * @revision 21
 *
 */
 
(function($) {

/**
 * @method hoverscroll
 * @param	params {Object}  Parameter list
 * 	params = {
 * 		vertical {Boolean},	// Vertical list or not ?
 * 		width {Integer},	// Width of list container
 * 		height {Integer},	// Height of list container
 *  	arrows {Boolean},	// Show direction indicators or not
 * 		debug {Boolean}		// Debug output in firebug console
 * 	};
 */
$.fn.hoverscroll = function(params) {
	if (!params) { params = {}; }

	// Loop through all the elements
	this.each(function() {
		var $this = $(this);
		
		$this.wrap('<div class="listcontainer"></div>')
		$this.addClass('list');
		
		// store handle to listcontainer
		var listctnr = $this.parent();
		
		// wrap listcontainer with a div.hoverscroll
		listctnr.wrap('<div class="hoverscroll"></div>');
		
		// store hoverscroll container
		var ctnr = listctnr.parent();

        var leftArrow, rightArrow;

		// Add arrow containers
		leftArrow = '<div class="arrow left"></div>';
        rightArrow = '<div class="arrow right"></div>';

        listctnr.before(leftArrow).after(rightArrow);		
		
		// Apply parameters width and height
		ctnr.width(params.width).height(params.height);
		
		leftArrow = listctnr.prev();
        rightArrow = listctnr.next();
                
        listctnr.height(params.height)
        	.width(params.width - (leftArrow.width() + rightArrow.width()));
		
		var size = 0;
		var arrowSize = leftArrow.width();
		ctnr.addClass('horizontal');
			
		// Determine content width
		$this.children().each(function() {
			$(this).addClass('item');
				
			if ($(this).outerWidth) {
				size += $(this).outerWidth(true);
			}
			else {
				// jQuery < 1.2.x backward compatibility patch
				size += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right'))
					+ parseInt($(this).css('margin-left')) + parseInt($(this).css('margin-right'));
			}
		});
		// Apply computed width to listcontainer
		$this.width(size);
			
		// Retrieve container width instead of using the given params.width to include padding
		if (ctnr.outerWidth) {
			size = ctnr.outerWidth();
		} else {
			// jQuery < 1.2.x backward compatibility patch
			size = ctnr.width() + parseInt(ctnr.css('padding-left')) + parseInt(ctnr.css('padding-right'))
				+ parseInt(ctnr.css('margin-left')) + parseInt(ctnr.css('margin-right'));
		}
		
		// Define hover zones on container
		var zone = {
			1: {action: 'move', from: 0, to: arrowSize, direction: -1 , speed: 12},
			2: {action: 'stop', from: arrowSize, to: size - arrowSize},
			3: {action: 'move', from: size - arrowSize, to: size, direction: 1 , speed: 12}
		}
		
		// Store default state values in container
		ctnr[0].isChanging = false;
		ctnr[0].direction  = 0;
		ctnr[0].speed      = 1;
		
		
		/**
		 * Check mouse position relative to hoverscroll container
		 * and trigger actions according to the zone table
		 *
		 * @param x {Integer} Mouse X event position
		 * @param y {Integer} Mouse Y event position
		 */
		function checkMouse(x, y) {
			x = x - ctnr.offset().left;
			y = y - ctnr.offset().top;
			
			var pos;
			pos = x;
			
			for (i in zone) {
				if (pos >= zone[i].from && pos < zone[i].to) {
					if (zone[i].action == 'move') {startMoving(zone[i].direction, zone[i].speed);}
					else {stopMoving();}
				}
			}
		}
		
		/**
		 * Start scrolling the list with a given speed and direction
		 *
		 * @param direction {Integer}	Direction of the displacement, either -1|1
		 * @param speed {Integer}		Speed of the displacement (20 being very fast)
		 */
		function startMoving(direction, speed) {
			if (ctnr[0].direction != direction) {
				stopMoving();
				ctnr[0].direction  = direction;
				ctnr[0].isChanging = true;
				move();
			}
			if (ctnr[0].speed != speed) {
				ctnr[0].speed = speed;
			}
		}
		
		/**
		 * Stop scrolling the list
		 */
		function stopMoving() {
			if (ctnr[0].isChanging) {
				ctnr[0].isChanging = false;
				ctnr[0].direction  = 0;
				ctnr[0].speed      = 1;
				clearTimeout(ctnr[0].timer);
			}
		}
		
		/**
		 * Move the list one step in the given direction and speed
		 */
		function move() {
			if (ctnr[0].isChanging == false) {return;}
			
			var scrollSide;
			scrollSide = 'scrollLeft';
			
			listctnr[0][scrollSide] += ctnr[0].direction * ctnr[0].speed;
			ctnr[0].timer = setTimeout(function() {move();}, 50);
		}
		
		// Bind actions to the hoverscroll container
		ctnr
		// Bind checkMouse to the mousemove
		.mousemove(function(e) {checkMouse(e.pageX, e.pageY);})
		// Bind stopMoving to the mouseleave
		// jQuery 1.2.x backward compatibility, thanks to Andy Mull!
		// replaced .mouseleave(...) with .bind('mouseleave', ...)
		.bind('mouseleave', function() {stopMoving();});

        // Bind the startMoving and stopMoving functions
        // to the HTML object for external access
        this.startMoving = startMoving;
        this.stopMoving = stopMoving;
		
	});
	return this;
};


// Backward compatibility with jQuery 1.1.x
if (!$.fn.offset) {
	$.fn.offset = function() {
		this.left = this.top = 0;
		
		if (this[0] && this[0].offsetParent) {
			var obj = this[0];
			do {
				this.left += obj.offsetLeft;
				this.top += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		
		return this;
	}
}
})(jQuery);
