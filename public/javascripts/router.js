/*globals app, Backbone, $, resize, _gaq */
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/menu',
	'models/page',
	'globals',
	'jQueryUI',
	'jQueryNoSpam'
], function( $, _, Backbone, MenuView, PageModel, globals){

	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.options = options;
			this.pages = options.pages;


			
		},
		routes: {
			// Define some URL routes
			"": "defaultPage",
			"/": "defaultPage",
			":p": 'showPage',
			":p/:sp": 'showPage'

		},
		showPage: function( pageName, subPage) {
			globals.clickCount++;
			//GA tracking
			var virtualPageview = pageName;
			if (typeof subPage !== 'undefined') {
				virtualPageview += '/' + subPage;
			}
			_gaq.push(['_trackPageview', virtualPageview]);
			window.scrollTo(0, 1);
		
			//load the menu
			var router = this;
			//@todo refactor menu
			var menu = new MenuView({page: pageName});

			$('.menu-wrapper').html(menu.render().el);

			this.pages.each(function(page){
				$('.pages-wrapper').append(page.renderPageView(router));
			});



			$('.pages-wrapper').css({ '-webkit-transform': 'translateZ(-'+(globals.pageWidth/3.45)+'px) ' });

			setTimeout(function(){


				$('.pages-wrapper').css({ '-webkit-transition': '-webkit-transform 1s ','-webkit-transform': 'translateZ(-'+(globals.pageWidth/3.45)+'px) rotateY(-120deg)'});
				
			},800);

		
			//need 404 handling here
			//also, dont like this. needs to be cleaner...

			//tmp for 3d
			
				
			//@todo add 404
			this.stylize();
			
			



		},
		stylize: function(){
			var wrapperHeight = $('.page:first').height(),
				pageHeight    = $(window).height();
			
			//if the page is larger than the content, reset the wrapper height
			if ( (pageHeight - globals.footerHeight) > wrapperHeight ) {
				wrapperHeight = pageHeight - globals.footerHeight;
			}

			$('.page').css({height:wrapperHeight + 'px'});

			$('.pages').css({height: wrapperHeight + 'px'});

			if ($('.about-column').length) {
				var maxColumnHeight = 0;
				$('.about-column').each(function(i,col){
					
					if ($(col).height() > maxColumnHeight) {
						maxColumnHeight = $(col).height();
					}
				});
				$('.about-column').css({height:maxColumnHeight+ 'px'});
			}

			
			//$('.footer').css({top: wrapperHeight +'px'});
			$('a.emailNoReplace').nospam({
				
			});

			$('a.email').nospam({
				replaceText:true
			});

		},
		//refactor pages later
		defaultPage: function() {
			this.showPage('home');


		}

	});

	
	var initialize = function(options){
		var appRouter = new AppRouter(options);
		// $(window).resize(function(){
		// 	appRouter.stylize();
		// });
		Backbone.history.start({pushState:true});
	};

	return {
		initialize: initialize
	};
});
	
