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


	var createBird = function(point, attr) {
		var path25 = paper.path("m 216.97701,68.72548 c -7.60401,1.298797 -18.63251,-0.0513 -24.47607,-2.482694 12.14263,-1.005388 20.36424,-6.524765 23.53224,-14.017987 -4.37652,2.694031 -17.96978,5.628124 -25.4671,2.831502 -0.37343,-1.762507 -0.77969,-3.44089 -1.19211,-4.959232 -5.70814,-21.012617 -25.29064,-37.946229 -45.79441,-35.89852 1.65376,-0.670943 3.33009,-1.294694 5.02489,-1.863046 2.24468,-0.808414 15.49734,-2.9710253 13.4127,-7.6430035 C 160.25259,0.572459 144.06379,7.7907371 141.0189,8.7407266 145.0425,7.232644 151.69858,4.6309451 152.40646,3.1740001e-6 146.24486,0.84535013 140.19407,3.7630282 135.52209,8.0041257 137.21278,6.1882712 138.49106,3.974365 138.7619,1.5860546 122.31867,12.103648 112.71414,33.290669 104.94597,53.858043 98.84593,47.934458 93.42504,43.270688 88.57661,40.675144 74.96693,33.378897 58.68785,25.75436 33.14278,16.258569 c -0.78585,8.459625 4.17749,19.717923 18.47042,27.192678 -3.09414,-0.41857 -8.75714,0.519109 -13.27934,1.594259 1.84048,9.703023 7.86665,17.686628 24.19088,21.544036 -7.45834,0.490384 -11.31985,2.199544 -14.80999,5.851771 3.39575,6.746361 11.69534,14.676618 26.59971,13.045427 -16.58686,7.158776 -6.76483,20.40938 6.732,18.43144 -23.01109,23.80513 -59.3015,22.03852 -80.14177,2.14619 54.40177,74.20998 172.67238,43.88213 190.28924,-27.59483 13.21778,0.106694 20.96953,-4.575543 25.78308,-9.74406 z");
		path25.attr({id: 'path25',"clip-path": 'none',fill: '#33ccff','stroke-width': '0','stroke-opacity': '1'}).data('id', 'path25');
		path25.attr(attr);
		
		//path25.scale(1,-1,0,0);
		//size is scaled down by the random radius betweem 0 & 50
		var r = point.r/50;
		if (r < 0.2) {
			r = r + 0.2;
		}
		path25.r = r;
		path25.scale(r,r);
	
		return path25;
	};

	var createToolTip = function(circle) {
		var bbox =  circle.getBBox(),

			//x +100 is the middle, however
			centerTip = bbox.x + 100,
			//i only need to move it in relation to the size
			radiusTip = bbox.x + (bbox.width/2),

			distanceToMove = centerTip - radiusTip,
			//all the words in the tweet
			tweetWords = circle.data('tweet').split(' '),
			//default the counter to 0, later increment as i go through each word
			//it is the num_chars on the line
			num_chars = 0,
			//what it says
			maxCharsPerLine = 25,
			//grab the twee and split it into multiple lines based on the above vars
			//example
			//this is my tween that is more than one line and it breaks at twenty five
				//-> this is my tween that is more than one\n line and it breaks at twenty five
			tweet = _.map(tweetWords,function(word){
				num_chars += word.length;
				
				//break at 35 characters
				if (num_chars >= maxCharsPerLine) {
					word = word +'\n' ;
					num_chars = 0;
				}
				return word;

			}).join(' ');

		//get the default points for the box wrapper/bg and text
		var tipPoints = {
			x: bbox.x - distanceToMove,
			y: bbox.y-70
		},
		//the text
		textPoints = {
			x: (bbox.x - distanceToMove)+125,
			y: (bbox.y-35)
		};

		//dont want the bubble above the canvas
		//so move it below the dot if its < 100 px
		//to the top
		if (bbox.y < 100) {
			tipPoints.y += bbox.height+70;
			textPoints.y += bbox.height+70;
		}
		
		//dont want it to the left either
		//move it right if it is
		if (bbox.x < 40) {
			tipPoints.x += bbox.width * 1.5;
			textPoints.x += bbox.width * 1.5;
		}

		var tip = paper.rect(tipPoints.x,tipPoints.y,250,70,4).attr({fill:'#333333','fill-opacity':0.8,'stroke':'none'}),
			text = paper.text(textPoints.x,textPoints.y,tweet);

		text.attr({fill:'#FFFFFF'});
		return {
			tip: tip,
			text: text
		};

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

	var start = function () {
		this.ox = this.attr("cx");
		this.oy = this.attr("cy");
		this.bbox = this.getBBox();
		this.lastDx = 0;
		this.lastDy = 0;
		this.animate({opacity: 0.25}, 500, ">");
		
		this.scale(1/this.r,1/this.r);
	},
	move = function (dx, dy) {
		//distance to move
		var x = dx - this.lastDx;
		var y = dy - this.lastDy;
		
		
		
			
		this.translate(x,y);
		this.lastDx = dx;
		this.lastDy = dy;

	},
	up = function () {
		
		this.animate({opacity: 1}, 500, ">");
		this.scale(this.r,this.r);
		this.tipObj.tip.remove();

		this.tipObj.text.remove();
	};

	return {
		createPaper: function() {
			$('#rCanvas').html('');
			paper = new Raphael($('#rCanvas').get(0));
		},
		paint: function(self) {
				

	
				getTweets(function(tweets){
					for (var i =0; i < tweets.length; i++) {
						//making a function within a loop is okay
						//here because i need to maintain i as well
						//as keep tip and text scopped locally
						(function(i){
							var tweet = tweets[i],
								attr = {fill: '#' + bubbleColors[getRandomNumber(0,15)] ,stroke:'none',opacity:1},
								point = getRandomPointAndSize(0,600,0,340),
								tweetyBird = createBird(point, attr),
								bbox = tweetyBird.getBBox();

							//point.y = 0;
							if (bbox.y2 + bbox.height*2 +20 > 340) {
								point.y = 340 - bbox.height * (getRandomNumber(10,20)/10) *1.25;
							}

							tweetyBird.translate(point.x,point.y);

							tweetyBird.animate({r:point.r + 20}, 1000, 'elastic');
							tweetyBird.data('tweet',tweet);



						
							tweetyBird.drag(move, start, up);
						
							var tip, text;
							tweetyBird.hover(function(){
								var tipObj = createToolTip(this);
								tip = tipObj.tip;
								text = tipObj.text;
								this.tipObj = tipObj;
								document.body.style.cursor = "pointer";

							}, function(){
								tip.remove();
								text.remove();
								document.body.style.cursor = "default";
							});
						}(i));
					}
				});
			}
	};

});