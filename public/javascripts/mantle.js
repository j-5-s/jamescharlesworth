/*globals $,Backbone, window, document, cwidth*/
/*jshint smarttabs:true */
//This file loads the main app with the bootstrap daata
//and router
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'Raphael',
	'globals'
], function( $, _, Backbone,Raphael,globals){
	
	var paper,
		tweets = [];

	var createCircle = function(x,y,r, attr) {
		return paper.circle(x, y, r).attr(attr);
	};

	var createToolTip = function(circle) {
		var bbox =  circle.getBBox();

		//x +100 is the middle, however
		var centerTip = bbox.x + 100; 
		//i only need to move it in relation to the size
		var radiusTip = bbox.x + (bbox.width/2);

		var distanceToMove = centerTip - radiusTip;

		var tweetWords = circle.data('tweet').split(' ');
		var num_chars =0;
		
		var maxCharsPerLine = 25;
		var tweet = _.map(tweetWords,function(word){
			num_chars += word.length;
			
			//break at 35 characters
			if (num_chars >= maxCharsPerLine) {
				word = word +'\n' ;
				num_chars = 0;
			}
			return word;

		}).join(' ');

		var tipPoints = {
			x: bbox.x - distanceToMove,
			y: bbox.y-70
		};

		var textPoints = {
			x: (bbox.x - distanceToMove)+125,
			y: (bbox.y-35)
		};


		if (bbox.y < 100) {
			tipPoints.y += bbox.height+70;
			textPoints.y += bbox.height+70;
		} 
		
		if (bbox.x < 40) {
	

			tipPoints.x += bbox.width;
			textPoints.x += bbox.width;
		}

		var tip = paper.rect(tipPoints.x,tipPoints.y,250,70,4).attr({fill:'#333333','fill-opacity':0.8,'stroke':'none'});
		var text = paper.text(textPoints.x,textPoints.y,tweet);
		text.attr({fill:'#FFFFFF'});
		return {
			tip: tip,
			text: text
		}

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




	var dots = 0;
	return {
		createPaper: function() {
				
				
				
				paper = new Raphael($('#rCanvas').get(0));

		},


		paint: function(self) {
				
				getTweets(function(tweets){


					for (var i =0; i < tweets.length; i++) {
						
						(function(i){
							var tweet = tweets[i];
		
							var opacity = getRandomNumber(5,10)/10;

							var attr = {fill: '#' + bubbleColors[getRandomNumber(0,15)] ,stroke:'none',opacity:opacity};
							var point = getRandomPointAndSize(0,600,0,340);
							var redCircle = createCircle(point.x,point.y,point.r, attr);
							redCircle.animate({r:point.r + 20}, 1000, 'elastic');
							redCircle.data('tweet',tweet);
							
							var tip, text;
							redCircle.hover(function(){
								var tipObj = createToolTip(this);
								tip = tipObj.tip;
								text = tipObj.text;

							}, function(){
								tip.remove();
								text.remove();
							});
						}(i))
					

						
						

					}

				});
			}
	};

});