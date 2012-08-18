/*globals $,Backbone, window, document, cwidth*/
/*jshint smarttabs:true */
//This file loads the main app with the bootstrap daata
//and router
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'Raphael',
	'globals',
	'jqueryTipsy'
], function( $, _, Backbone,Raphael,globals){
	
	var paper,
		tweets = [];

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

	var getTweets = function (cb) {
		if (tweets.length) {
			return cb(tweets);
		}

		var url = 'https://api.twitter.com/1/statuses/user_timeline.json?callback=?';
		$.getJSON(url, {include_entities: "true", include_rts: "true", screen_name: "_jcharlesworth" }, function(res){

			tweets = _.map(res,function(el){
			
				if (typeof el.text !== 'undefined') {
					return el.text;
				}

			});

			cb(tweets);
		});
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
				
				getTweets(function(tweets){


					splatterKid = setInterval(function(){
	
						
							
							
							var opacity = getRandomNumber(5,10)/10;

							var attr = {fill: '#' + bubbleColors[getRandomNumber(0,15)] ,stroke:'none',opacity:opacity, title:tweets[dots]};
							var point = getRandomPointAndSize(0,600,0,340);
							var redCircle = createCircle(point.x,point.y,point.r, attr);
							redCircle.animate({r:point.r + 20}, 1000, 'elastic');
							redCircle.data('tweet',tweets[dots]);
							redCircle.click(function(){

								var bbox = this.getBBox();
								var a = this.node.parentNode;
								console.log($(a))
								$(a).tipsy({gravity: 's',fade: true, r:bbox.width/2, live:true });
							});

							dots++;
							if (dots >= tweets.length) {
								dots = 0;
								clearInterval(splatterKid);
								
								// $('.raphael-canvas a').each(function(i,a){
								
								// 	var r = parseInt($(this).find('circle').attr('r'),10);
								// 	console.log(r)
									
								// 	$(this).tipsy({gravity: 's',fade: true, r:r });
								// });
								
								

							}
						

					},20);

				});
			}
	};

});