/*globals $,Backbone, window, document, cwidth*/
//This file loads the main app with the bootstrap daata
//and router
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'Raphael',
	'globals',
], function( $, _, Backbone,Raphael,globals){
	
	return {
		paint: function(self) {
				$('.raphael-canvas').html('');
				var paper = new Raphael($('.raphael-canvas').get(0));

				// Creates circle at x = 50, y = 40, with radius 10
				var circle = paper.circle(50, 50, 10);
				// Sets the fill attribute of the circle to red (#f00)
				circle.attr({fill: '#a23a35',stroke:'none'});
				
				circle.click(function(){
					var html = _.toArray(self.redDots)[self.redDotIndex],
						key  = _.keys(self.redDots)[self.redDotIndex];

					globals.clickCount++;
					_gaq.push(['_trackPageview', 'red-dot' + '/' + key ]);

					html = _.template(html, {clickCount: globals.clickCount});
					$('.red-dot-text').html(html);
					if ( (self.redDotIndex +1) === _.toArray(self.redDots).length) {
						self.redDotIndex = 0;
					} else {
						self.redDotIndex++;
					}
					
				});
				circle.hover(function(){
					this.attr({cursor:'pointer'});
					this.animate({r:13}, 1000, 'elastic');
					
				},
				function(){
					this.animate({r:10}, 1000, 'elastic');
				});
			}	
	}
	

});	