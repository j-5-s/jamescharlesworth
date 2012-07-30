/*globals app, Backbone, $, resize*/
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/page',
	'views/menu',
	'models/page',
	'jQueryUI'
], function( $, _, Backbone, PageView, MenuView, PageModel ){

	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.options = options;
			this.pages = options.pages;
			
		},
		routes: {
			// Define some URL routes
			"": "default",
			"/": "default",
			":p": 'showPage',
			":p/:sp": 'showPage'

		},
		showPage: function( pageName, subPage) {
		
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
				
			}

			var page     = new PageView({model: pageModel, router: router}),
				pageHtml = page.render().el;

			$('.pages').append( pageHtml );
			
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
					in: (indexOfNewActiveLink > indexOfOldActiveLink) ? 'right' : 'left',
					out: (indexOfNewActiveLink > indexOfOldActiveLink) ? 'left' : 'right',
				};
			
				//setting the position to absolute makes the transition smoother
				$lastPage.css({position:'absolute',top: '90px'});
				
				$lastPage.show('slide', {direction: direction.in });
				$firstPage.hide('slide',{direction: direction.out });
				setTimeout(function(){
					//finally, remove the page that slide out and reset the position
					//of thenew page
					$firstPage.parent().parent().remove();
					$lastPage.css({position:'relative',top: '0px'});
				}, 350 );//350 is how long it takes to slide in/out
			}
		},

		//refactor pages later
		default: function() {
			this.showPage('home');
		}
	});

	
	var initialize = function(options){
		var appRouter = new AppRouter(options);
		Backbone.history.start({pushState:true});
	};

	return {
		initialize: initialize
	};
});
	
