/*globals app, Backbone, $, resize, _gaq */
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/menu',
	'models/page',
	'globals',
	'jQueryNoSpam'
], function( $, _, Backbone, MenuView, PageModel, globals){

	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.options = options;
			this.pages = options.pages;
			var router = this;


			this.loaded = false;

			
		},
		routes: {
			// Define some URL routes
			"": "defaultPage",
			"/": "defaultPage",
			":p": 'showPage',
			":p/:sp": 'showPage'

		},
		init: function(pageName, subPage){

			
			var router = this;
			
			$('.pages-wrapper').html('');
			router.pages.each(function(page){
				if (! $('.'+page.get('name')).length )
					$('.pages-wrapper').append(page.renderPageView(router, pageName, subPage));
			});
			
			
		},
		showPage: function( pageName, subPage) {

			globals.clickCount++;
			//GA tracking
			var virtualPageview = pageName;
			if (typeof subPage !== 'undefined') {
				virtualPageview += '/' + subPage;
			}
			_gaq.push(['_trackPageview', virtualPageview]);
			//window.scrollTo(0, 1);
			
			//load the menu
			var router = this;
			router.init(pageName, subPage);
			//@todo refactor menu
			var menu = new MenuView({page: pageName});

			$('.menu-wrapper').html(menu.render().el);

			$('.page').removeClass('active');
			$('.'+pageName).addClass('active');


			if (pageName === 'home') {
				globals.transition($('.pages-wrapper'), 0, 'home');
			
			} else if ( pageName === 'about') {
				globals.transition($('.pages-wrapper'), -120, 'about');
				
			} else if ( pageName === 'projects') {
				globals.transition($('.pages-wrapper'),  -240 , 'projects');

			}

		

			//need 404 handling here

			router.stylize(pageName);

		},
		stylize: function(pageName){
			var wrapperHeight = $('.'+pageName + ' .container').height() +50,
				pageHeight    = $(window).height();
	
			if (pageHeight === 0){

				return this.stylize(pageName);
			}
			
			//if the page is larger than the content, reset the wrapper height
			if ( (pageHeight - globals.footerHeight) > wrapperHeight ) {
				wrapperHeight = pageHeight - globals.footerHeight;
			}

			$('.page').css({height:wrapperHeight + 'px'});

			$('.pages').css({height: wrapperHeight + 'px'});


			if ($('.about-column').length) {
				//var maxColumnHeight = 0;
				if ($('.about-column:first').height() === 0) {
					$('.about-column').css({height: '344px'});
				} else {
					var maxColumnHeight = 0;
					$('.about-column').each(function(i,col){
						
						if ($(col).height() > maxColumnHeight) {
							maxColumnHeight = $(col).height();
							
						}
					});	
					$('.about-column').css({height: maxColumnHeight +'px'});				
				}

				
			}

			
			//$('.footer').css({top: wrapperHeight +'px'});
			$('a.emailNoReplace').nospam({
				
			});

			setTimeout(function(){
				$('#jsloader').remove();
			},400);

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
		//appRouter.init()
		// $(function(){
		 
			$(window).resize(function(){
				if (globals.pageWidth !== $(window).width()) {
					globals.loaded = false;
					globals.pageWidth = $(window).width();
					globals.pageHeight = $(window).height();
					$('.pages-wrapper').html('');
					
					appRouter.init('home');
					globals.transition($('.pages-wrapper'), 0, 'home');
					appRouter.stylize('home');
				}
			});			
		// })

		Backbone.history.start({pushState:true});
	};

	return {
		initialize: initialize
	};
});
	
