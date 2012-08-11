//swiper stop swipping!
define(['jQuery'],function($){

	var swiper = function( el, cb ) {
		
		var self = el;
		


		var originalCoord = { 'x': 0, 'y': 0 },
		    finalCoord = { 'x': 0, 'y': 0 },
		    options = {
				'threshold': {
					'x': 100,
					'y': 100
				},
				'swipeLeft': function() {
					//slide image left
					
					cb(1);
				},
				'swipeRight': function() {
					//slide image right

					cb(-1);
				}
		    };

		function touchStart(event) {

			var touch = event.originalEvent.targetTouches[0];
			originalCoord.x = touch.pageX;
			originalCoord.y = touch.pageY;
		}

		// Store coordinates as finger is swiping
		function touchMove(event) {
			var touch = event.originalEvent.targetTouches[0];
			finalCoord.x = touch.pageX; // Updated X,Y coordinates
			finalCoord.y = touch.pageY;
			//dont prevent if its vertical
			event.preventDefault();
		
		}

		// Swipe was canceled
		function touchCancel() {
			//console.log('Canceling swipe gesture')
		}

		// Done swiping
		// Swipe should only be on X axis, ignore if swipe on Y axis
		// Calculate if the swipe was left or right
		function touchEnd() {
			var changeY = originalCoord.y - finalCoord.y,
			    changeX,
			    threshold = options.threshold,
			    y = threshold.y,
			    x = threshold.x;
			if (changeY < y && changeY > (- y)) {
				changeX = originalCoord.x - finalCoord.x;
				if (changeX > x) {
					options.swipeLeft.call(self);
				} else if (changeX < (- x)) {
					options.swipeRight.call(self);
				}
			}
		}
		
		$(self)
			.live('touchstart.swipe', touchStart)
			.live('touchmove.swipe', touchMove)
			.live('touchend.swipe', touchEnd)
			.live('touchcancel.swipe', touchCancel);
	};

	return swiper;
});		