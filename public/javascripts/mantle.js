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
	
	var paper;

	var createCircle = function(x,y,r, attr) {
		return paper.circle(x, y, r).attr(attr);
	};

	var getRandomNumber = function(min,max) {
    	return Math.floor(Math.random() * (max - min) + min);
	};

	/**
	 * Need to get a x and y location with a size that 
	 * will not extend outside of the x and y min or max
	 */
	var getRandomPointAndSize = function(xMin,xMax,yMin,yMax) {
		var point = {};
		var radius = getRandomNumber(0,50);

		var x = getRandomNumber(xMin,xMax),
			y = getRandomNumber(yMin,yMax);

		var distanceFromTop    = y - (radius * 2 + 20),
			distanceFromBottom = y + (radius * 2 + 20),
			distanceFromLeft   = x - (radius * 2 + 20),
			distanceFromRight  = x + (radius * 2 + 20);


		if (distanceFromTop < yMin) {
			y = y + Math.abs(distanceFromTop);
		}

		if (distanceFromBottom > yMax){
			y = y - distanceFromBottom;
		}

		if (distanceFromLeft < xMin) {
			x = x + Math.abs(distanceFromLeft);
		}

		if (distanceFromRight > xMax) {
			x = x - distanceFromRight;
		}
		
		return {
			x: x,
			y: y,
			r: radius	
		};


    	
	};
	

	var bubbleColors = [


		'A23A35',	'7A3F3C',	'691611',	'D16D67',	'D18783',

		'215D63',	'25474A',	'0B3C40',	'59A9B1',	'70ABB1',

		'729631',	'5D7138',	'456210',	'A6CB64',	'B0CB80'

	];

	var splatterKid,
		dots = 0;
	return {
		createPaper: function() {
				$('.raphael-canvas').html('');
				paper = new Raphael($('.raphael-canvas').get(0));
		},


		paint: function(self) {
				
				splatterKid = setInterval(function(){

					var opacity = getRandomNumber(5,10)/10;

					var attr = {fill: '#' + bubbleColors[getRandomNumber(0,15)] ,stroke:'none',opacity:opacity};	
					var point = getRandomPointAndSize(0,600,0,340);
					var redCircle = createCircle(point.x,point.y,point.r, attr);
					redCircle.animate({r:point.r + 20}, 1000, 'elastic');

					redCircle.hover(function(){
						this.animate({r:point.r - 30},300,'elastic',function(){
							this.remove();	
						});
						
					});

					dots++;
					if (dots > 100) {
						dots = 0;
						clearInterval(splatterKid);

					}
				},20);

				

				
			
				// Creates circle at x = 50, y = 40, with radius 10
				
				// Sets the fill attribute of the circle to red (#f00)
				
				
				// circle.click(function(){
				// 	var html = _.toArray(self.redDots)[self.redDotIndex],
				// 		key  = _.keys(self.redDots)[self.redDotIndex];

				// 	globals.clickCount++;
				// 	_gaq.push(['_trackPageview', 'red-dot' + '/' + key ]);

				// 	html = _.template(html, {clickCount: globals.clickCount});
				// 	$('.red-dot-text').html(html);
				// 	if ( (self.redDotIndex +1) === _.toArray(self.redDots).length) {
				// 		self.redDotIndex = 0;
				// 	} else {
				// 		self.redDotIndex++;
				// 	}
					
				// });
				// circle.hover(function(){
				// 	this.attr({cursor:'pointer'});
				// 	this.animate({r:13}, 1000, 'elastic');
					
				// },
				// function(){
				// 	this.animate({r:10}, 1000, 'elastic');
				// });
			}	
	}
	

});	