/*globals app, Backbone, $, resize, _gaq */
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/about',
	'views/home',
	'views/projects',
	'views/menu',
	'models/page',
	'globals',
	'jQueryUI',
	'jQueryNoSpam'
], function( $, _, Backbone, AboutView, HomeView, ProjectsView, MenuView, PageModel, globals){

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
		
			//load the menu
			var router = this;
			//@todo refactor menu
			var menu = new MenuView({page: pageName});

			$('.menu-wrapper').html(menu.render().el);

			var pageModel = this.pages.getByName( pageName );
			//need 404 handling here
			//also, dont like this. needs to be cleaner...

			if (subPage) {
				pageModel.set('subPage', subPage );
				pageModel.get('subPages').getSubPageByURLHash(subPage).set('active', true);
			}


			var page;
			//make dynamic
			if (pageName === 'home') {
				page = new HomeView({model: pageModel, router: router});
			} else if (pageName === 'projects') {
				page = new ProjectsView({model: pageModel, router: router});

			} else if (pageName === 'about') {
				page = new AboutView({model: pageModel, router: router});
			}
			//@todo add 404

			var pageHtml = page.render().el;
			


			$('.pages').append( pageHtml );
			

						
			this.stylize();
			//if multiple pages exist, the transition needs to happen
			//goal is to determine the direction to slide, left to
			//right or right to left. Then slide one in and one out
			//and finally remove the page that was slided out.
			//At this point I have two pages in the dom if a menu
			//link is clicked
			if ($('.pages .page').length > 1) {
				var $firstPage = $('.pages .page:first'),
					$lastPage  = $('.pages .page:last');

				//use the menu as the key to which direction to slide
				//basing the current page on the class `active`
				var $firstPageMenu = $('.menu li a',$firstPage),
					$lastPageMenu = $('.menu li a',$lastPage);

					var indexOfOldActiveLink = $firstPageMenu.map(function(index, a){
						if ($(a).hasClass('active')){
							return index;
						}
					})[0];

					var indexOfNewActiveLink = $lastPageMenu.map(function(index,a){
						if ($(a).hasClass('active')){
							return index;
						}
					})[0];

				var direction = {
					'movein': (indexOfNewActiveLink > indexOfOldActiveLink) ? 'right' : 'left',
					'moveout': (indexOfNewActiveLink > indexOfOldActiveLink) ? 'left' : 'right'
				};
			
				//setting the position to absolute makes the transition smoother
				$lastPage.css({position:'absolute',top: '90px'});

				
							
				
				$lastPage.show('slide', {direction: direction.movein },350);
				$firstPage.hide('slide',{direction: direction.moveout },350);

				//need the parent now because after the slide its differnt
				var $parent = $firstPage.parent().parent();
				
				//hack for ie. red dot needs to wait for page to slide
				setTimeout(function(){
					if (pageName === 'home') {
						page.renderRaphael();
					}
				},500); //500 must be greater than swipe speed
										
				setTimeout(function(){
					//finally, remove the page that slide out and reset the position
					//of the new page
					$parent.remove();
					$lastPage.css({position:'relative',top: '0px'});

					//page.swiper();
				
				}, 350 );//350 is how long it takes to slide in/out
			} else {
				//page.swiper(router);
				if (pageName === 'home') {
					page.renderRaphael();
				}
			}



		},
		stylize: function(){
			var wrapperHeight = $('.page:last').height(),
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
		$(window).resize(function(){
			appRouter.stylize();
		});
		Backbone.history.start({pushState:true});
	};

	return {
		initialize: initialize
	};
});
	
