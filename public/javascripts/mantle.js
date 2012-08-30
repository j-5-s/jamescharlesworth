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
	
	var paper;


	var createBird = function(point, attr) {
		var path25 = paper.path("m 216.97701,68.72548 c -7.60401,1.298797 -18.63251,-0.0513 -24.47607,-2.482694 12.14263,-1.005388 20.36424,-6.524765 23.53224,-14.017987 -4.37652,2.694031 -17.96978,5.628124 -25.4671,2.831502 -0.37343,-1.762507 -0.77969,-3.44089 -1.19211,-4.959232 -5.70814,-21.012617 -25.29064,-37.946229 -45.79441,-35.89852 1.65376,-0.670943 3.33009,-1.294694 5.02489,-1.863046 2.24468,-0.808414 15.49734,-2.9710253 13.4127,-7.6430035 C 160.25259,0.572459 144.06379,7.7907371 141.0189,8.7407266 145.0425,7.232644 151.69858,4.6309451 152.40646,3.1740001e-6 146.24486,0.84535013 140.19407,3.7630282 135.52209,8.0041257 137.21278,6.1882712 138.49106,3.974365 138.7619,1.5860546 122.31867,12.103648 112.71414,33.290669 104.94597,53.858043 98.84593,47.934458 93.42504,43.270688 88.57661,40.675144 74.96693,33.378897 58.68785,25.75436 33.14278,16.258569 c -0.78585,8.459625 4.17749,19.717923 18.47042,27.192678 -3.09414,-0.41857 -8.75714,0.519109 -13.27934,1.594259 1.84048,9.703023 7.86665,17.686628 24.19088,21.544036 -7.45834,0.490384 -11.31985,2.199544 -14.80999,5.851771 3.39575,6.746361 11.69534,14.676618 26.59971,13.045427 -16.58686,7.158776 -6.76483,20.40938 6.732,18.43144 -23.01109,23.80513 -59.3015,22.03852 -80.14177,2.14619 54.40177,74.20998 172.67238,43.88213 190.28924,-27.59483 13.21778,0.106694 20.96953,-4.575543 25.78308,-9.74406 z");
		path25.attr({id: 'path25',"clip-path": 'none',fill: '#33ccff','stroke-width': '0','stroke-opacity': '1'}).data('id', 'path25');
		path25.attr(attr);
		

		var bbox = path25.getBBox();

		//dont want them too close to the bottom
		if (bbox.y2 + bbox.height*2 +20 > 340) {
			point.y = 340 - bbox.height * (getRandomNumber(10,20)/10) *1.25;
		}


		//why wont little birds fly far?
		//move it before the scale it
		path25.translate(point.x,point.y);
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
			tipPoints.x += bbox.width * 0.5;
			textPoints.x += bbox.width * 0.5;
		}
		tweet = tweet.replace(/&gt;/g,'>').replace(/&lt;/g,'<');


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
		if (globals.tweets.length) {
			return cb(globals.tweets);
		}

		var localDevTeets  = [{"created_at":"Tue Aug 21 20:21:43 +0000 2012","id":238007999476670464,"id_str":"238007999476670464","text":"FF 15 -&gt; ctrl+shift+m is a great feature. #MobileFirst","source":"\u003ca href=\"http:\/\/twitter.com\/download\/iphone\" rel=\"nofollow\"\u003eTwitter for iPhone\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[{"text":"MobileFirst","indices":[45,57]}],"urls":[],"user_mentions":[]},"favorited":false,"retweeted":false},{"created_at":"Wed Aug 08 00:57:34 +0000 2012","id":233003987031429120,"id_str":"233003987031429120","text":"I think the 30 minutes I just spent playing with this mobile web debug tool will save me 1000 of development hours. http:\/\/t.co\/zVCjvUz3","source":"web","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[],"urls":[{"url":"http:\/\/t.co\/zVCjvUz3","expanded_url":"http:\/\/goo.gl\/JFlsR","display_url":"goo.gl\/JFlsR","indices":[116,136]}],"user_mentions":[]},"favorited":false,"retweeted":false,"possibly_sensitive":false},{"created_at":"Sat Aug 04 03:05:54 +0000 2012","id":231586732020215809,"id_str":"231586732020215809","text":"RT @scottsimpson: Every Olympic event should include one average person competing, for reference.","source":"\u003ca href=\"http:\/\/twitter.com\/download\/iphone\" rel=\"nofollow\"\u003eTwitter for iPhone\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweeted_status":{"created_at":"Fri Aug 03 16:54:18 +0000 2012","id":231432818176188417,"id_str":"231432818176188417","text":"Every Olympic event should include one average person competing, for reference.","source":"\u003ca href=\"http:\/\/birdhouseapp.com\" rel=\"nofollow\"\u003eBirdhouse\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":926981,"id_str":"926981","name":"Scott Simpson","screen_name":"scottsimpson","location":"Burlingame Volunteer Living","url":"http:\/\/yourmonkeycalled.com","description":"Shame is sexy","protected":false,"followers_count":22281,"friends_count":214,"listed_count":1790,"created_at":"Sun Mar 11 15:12:52 +0000 2007","favourites_count":13833,"utc_offset":-28800,"time_zone":"Pacific Time (US & Canada)","geo_enabled":true,"verified":false,"statuses_count":4052,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"9AE4E8","profile_background_image_url":"http:\/\/a0.twimg.com\/profile_background_images\/79992\/P1000081_2.jpg","profile_background_image_url_https":"https:\/\/si0.twimg.com\/profile_background_images\/79992\/P1000081_2.jpg","profile_background_tile":true,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/63487780\/twitterphoto_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/63487780\/twitterphoto_normal.jpg","profile_link_color":"A81F19","profile_sidebar_border_color":"203576","profile_sidebar_fill_color":"D0C3C8","profile_text_color":"000000","profile_use_background_image":true,"show_all_inline_media":true,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":2785,"entities":{"hashtags":[],"urls":[],"user_mentions":[]},"favorited":false,"retweeted":false},"retweet_count":2785,"entities":{"hashtags":[],"urls":[],"user_mentions":[{"screen_name":"scottsimpson","name":"Scott Simpson","id":926981,"id_str":"926981","indices":[3,16]}]},"favorited":false,"retweeted":false},{"created_at":"Mon Jul 09 13:06:01 +0000 2012","id":222315673643270144,"id_str":"222315673643270144","text":"RT @jrburke: Like to use AMD modules\/requirejs and jQuery UI? Use this npm-installable jQueryUI-to-AMD converter: https:\/\/t.co\/NYrNhibX","source":"\u003ca href=\"http:\/\/twitter.com\/download\/iphone\" rel=\"nofollow\"\u003eTwitter for iPhone\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweeted_status":{"created_at":"Mon Jul 09 03:45:45 +0000 2012","id":222174676359725056,"id_str":"222174676359725056","text":"Like to use AMD modules\/requirejs and jQuery UI? Use this npm-installable jQueryUI-to-AMD converter: https:\/\/t.co\/NYrNhibX","source":"\u003ca href=\"http:\/\/twitterrific.com\" rel=\"nofollow\"\u003eTwitterrific for Mac\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":24280271,"id_str":"24280271","name":"James Burke","screen_name":"jrburke","location":"Vancouver, BC","url":"http:\/\/tagneto.blogspot.com","description":"Open source web developer. Mozilla Labs, RequireJS, Dojo.","protected":false,"followers_count":2837,"friends_count":156,"listed_count":234,"created_at":"Fri Mar 13 23:24:45 +0000 2009","favourites_count":0,"utc_offset":-28800,"time_zone":"Pacific Time (US & Canada)","geo_enabled":true,"verified":false,"statuses_count":2070,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C6E2EE","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme2\/bg.gif","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme2\/bg.gif","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1609980914\/i-74XCxLj-XL-square-200_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1609980914\/i-74XCxLj-XL-square-200_normal.jpg","profile_link_color":"1F98C7","profile_sidebar_border_color":"C6E2EE","profile_sidebar_fill_color":"DAECF4","profile_text_color":"663B12","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":6,"entities":{"hashtags":[],"urls":[{"url":"https:\/\/t.co\/NYrNhibX","expanded_url":"https:\/\/github.com\/jrburke\/jqueryui-amd","display_url":"github.com\/jrburke\/jquery\u2026","indices":[101,122]}],"user_mentions":[]},"favorited":false,"retweeted":false,"possibly_sensitive":false},"retweet_count":6,"entities":{"hashtags":[],"urls":[{"url":"https:\/\/t.co\/NYrNhibX","expanded_url":"https:\/\/github.com\/jrburke\/jqueryui-amd","display_url":"github.com\/jrburke\/jquery\u2026","indices":[114,135]}],"user_mentions":[{"screen_name":"jrburke","name":"James Burke","id":24280271,"id_str":"24280271","indices":[3,11]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false},{"created_at":"Sun Jul 08 02:04:06 +0000 2012","id":221786707278835713,"id_str":"221786707278835713","text":"@yourfavorite http:\/\/t.co\/qaCkcRWH looks awesome! Love the responsive design.","source":"web","truncated":false,"in_reply_to_status_id":221008054618046464,"in_reply_to_status_id_str":"221008054618046464","in_reply_to_user_id":13181282,"in_reply_to_user_id_str":"13181282","in_reply_to_screen_name":"yourfavorite","user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[],"urls":[{"url":"http:\/\/t.co\/qaCkcRWH","expanded_url":"http:\/\/shakeshake.com","display_url":"shakeshake.com","indices":[14,34]}],"user_mentions":[{"screen_name":"yourfavorite","name":"Casey Britt","id":13181282,"id_str":"13181282","indices":[0,13]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false},{"created_at":"Sun Jul 01 12:19:05 +0000 2012","id":219404759013138432,"id_str":"219404759013138432","text":"Yeoman - Modern Workflows For Modern Web Apps http:\/\/t.co\/5zz1biIS via @angularjs","source":"\u003ca href=\"http:\/\/twitter.com\/tweetbutton\" rel=\"nofollow\"\u003eTweet Button\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[],"urls":[{"url":"http:\/\/t.co\/5zz1biIS","expanded_url":"http:\/\/yeoman.io","display_url":"yeoman.io","indices":[46,66]}],"user_mentions":[{"screen_name":"angularjs","name":"AngularJS","id":202230373,"id_str":"202230373","indices":[71,81]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false},{"created_at":"Sun Jun 17 01:31:57 +0000 2012","id":214168472480006144,"id_str":"214168472480006144","text":"ok, require.js by @jrburke is awesome. Not sure why it took me so long to give it a try.","source":"web","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[],"urls":[],"user_mentions":[{"screen_name":"jrburke","name":"James Burke","id":24280271,"id_str":"24280271","indices":[18,26]}]},"favorited":false,"retweeted":false},{"created_at":"Mon May 28 18:28:11 +0000 2012","id":207176458047725568,"id_str":"207176458047725568","text":"Futurico UI HTML - Free User Interface Elements for Developers http:\/\/t.co\/lOoiwZS9 #coding #html #css #js #haml #sass via @designmodo","source":"\u003ca href=\"http:\/\/twitter.com\/tweetbutton\" rel=\"nofollow\"\u003eTweet Button\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[{"text":"coding","indices":[84,91]},{"text":"html","indices":[92,97]},{"text":"css","indices":[98,102]},{"text":"js","indices":[103,106]},{"text":"haml","indices":[107,112]},{"text":"sass","indices":[113,118]}],"urls":[{"url":"http:\/\/t.co\/lOoiwZS9","expanded_url":"http:\/\/designmodo.com\/futurico-html\/","display_url":"designmodo.com\/futurico-html\/","indices":[63,83]}],"user_mentions":[{"screen_name":"designmodo","name":"DesignModo","id":178246193,"id_str":"178246193","indices":[123,134]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false},{"created_at":"Wed May 23 02:18:19 +0000 2012","id":205120443223506945,"id_str":"205120443223506945","text":"phantomjs is awesome!  http:\/\/t.co\/MqRAyJdF","source":"web","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":7,"entities":{"hashtags":[],"urls":[{"url":"http:\/\/t.co\/MqRAyJdF","expanded_url":"http:\/\/phantomjs.org\/","display_url":"phantomjs.org","indices":[23,43]}],"user_mentions":[]},"favorited":false,"retweeted":false,"possibly_sensitive":false},{"created_at":"Fri May 18 21:33:58 +0000 2012","id":203599333428432898,"id_str":"203599333428432898","text":"Mongodb's  geospatial indexing is great, however [long,lat] seem much less error prone than using objects like \u007blong:val,lat:val2\u007d","source":"\u003ca href=\"http:\/\/twitter.com\/download\/iphone\" rel=\"nofollow\"\u003eTwitter for iPhone\u003c\/a\u003e","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":153257574,"id_str":"153257574","name":"James Charlesworth","screen_name":"_jcharlesworth","location":"Atlanta, Ga","url":"http:\/\/www.jamescharlesworth.com","description":"JavaScript developer","protected":false,"followers_count":45,"friends_count":101,"listed_count":2,"created_at":"Tue Jun 08 02:37:03 +0000 2010","favourites_count":28,"utc_offset":-18000,"time_zone":"Quito","geo_enabled":false,"verified":false,"statuses_count":172,"lang":"en","contributors_enabled":false,"is_translator":false,"profile_background_color":"C0DEED","profile_background_image_url":"http:\/\/a0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_image_url_https":"https:\/\/si0.twimg.com\/images\/themes\/theme1\/bg.png","profile_background_tile":false,"profile_image_url":"http:\/\/a0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_image_url_https":"https:\/\/si0.twimg.com\/profile_images\/1426370757\/Photo_on_2011-07-03_at_18.47_normal.jpg","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"show_all_inline_media":false,"default_profile":true,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":0,"entities":{"hashtags":[],"urls":[],"user_mentions":[]},"favorited":false,"retweeted":false}];
		if (/^localhost/.test(window.location.host)) {
			
			globals.tweets = _.map(localDevTeets,function(el){
			
				if (typeof el.text !== 'undefined') {
					return el.text;
				}

			});			
			return cb(globals.tweets);
		}

		var url = 'https://api.twitter.com/1/statuses/user_timeline.json?callback=?';
		$.getJSON(url, {include_entities: "true", include_rts: "true", screen_name: "_jcharlesworth", count: 10 }, function(res,textStatus,jqXHR){
			
			if (typeof console !== 'undefined') {
				console.log('jqHXR',jqXHR);
			}	

			//tweet has rate limiting of 150 per hour
			//its kind of jacked up and does not really count each request
			//as 1 and can go through rather quickly
			if (jqXHR.status !== 200) {
				res = localDevTeets;
			}
			globals.tweets = _.map(res,function(el){
			
				if (typeof el.text !== 'undefined') {
					return el.text;
				}

			});

			cb(globals.tweets);
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
	var pageWidth = globals.pageWidth,
		containerWidth = pageWidth * 0.8,
		canvasSize = containerWidth * 1;
	return {
		createPaper: function() {


			$('#rCanvas').html('');
			paper = new Raphael('rCanvas',canvasSize, 340);

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
								point = getRandomPointAndSize(0,canvasSize*0.5,0,340),
								tweetyBird = createBird(point, attr);


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