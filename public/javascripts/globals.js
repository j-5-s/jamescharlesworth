/*globals app, Backbone, $, resize,window, document*/
// Filename: router.js
define([
	'jQuery',
	'Underscore'
], function( $, _ ){
	
	var globals = {};

	globals.pageWidth = $(window).width();
	globals.pageHeight = $(window).height();
	globals.footerHeight = 110;
	globals.headerHeight = 90;
	globals.screenContentHeight = globals.pageHeight - globals.footerHeight - globals.headerHeight;
	globals.clickCount = -1;
	globals.loaded = false;

	globals.supports = function(prop) { 
		//credit to http://net.tutsplus.com/tutorials/html-css-techniques/quick-tip-detect-css-support-in-browsers-with-javascript/
		var div = document.createElement('div'),
			vendors = 'Khtml Ms O Moz Webkit'.split(' '),
			len = vendors.length;

		if ( prop in div.style ) {
			return true;
		}

		prop = prop.replace(/^[a-z]/, function(val) {
			return val.toUpperCase();
		});
		
		while(len--) {
			if ( vendors[len] + prop in div.style ) {
				// browser supports box-shadow. Do what you need.
				// Or use a bang (!) to test if the browser doesn't.
				return true;
			}
		}
		return false;
		

	};

	globals.transition = function( $el, deg, pageName) {
		
		if (globals.supports('transition') && globals.supports('transform') ) {


			$el.css({
				//transition
				'-webkit-transition': '-webkit-transform 1s ',
				'-moz-transition': '-moz-transform 1s',
				'-o-transition': '-o-transform 1s',
				'transition': 'transform 1s',
				//transform
				'-webkit-transform': 'translateZ(-'+(globals.pageWidth/3.45)+'px) rotateY('+deg+'deg)',
				'-moz-transform': 'translateZ(-'+(globals.pageWidth/3.45)+'px) rotateY('+deg+'deg)',
				'-o-transform': 'translateZ(-'+(globals.pageWidth/3.45)+'px) rotateY('+deg+'deg)',
				'transform': 'translateZ(-'+(globals.pageWidth/3.45)+'px) rotateY('+deg+'deg)'
			});
			$('.pages-wrapper .page').not('.active').css({height:'200px',overflow:'hidden'});

		} else {
			//fallback for old browsers
			$('.page').hide();
			$('.'+pageName).show();
			$('.'+pageName).css({'height':globals.screenContentHeight + 'px'});
		}
	};

	globals.transform = function($el, deg, op) {
		if (globals.supports('transition') && globals.supports('transform') ) {

			$el.css({
				'-webkit-transform': 'rotateY('+deg+'deg) translateZ('+(globals.pageWidth/3.45)+'px)',
				'-moz-transform': 'rotateY('+deg+'deg) translateZ('+(globals.pageWidth/3.45)+'px)',
				'-o-transform': 'rotateY('+deg+'deg) translateZ('+(globals.pageWidth/3.45)+'px)',
				'transform': 'rotateY('+deg+'deg) translateZ('+(globals.pageWidth/3.45)+'px)'
			});
		}
	};

	globals.reset = function() {

	}



	return globals;
});