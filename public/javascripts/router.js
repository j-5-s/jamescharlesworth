/*globals app, Backbone, $, resize*/
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'views/page',
	'views/menu'
], function( $, _, Backbone, Page, Menu ){

	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.options = options;
			//this.navigate('/home', true)
		},
		routes: {
			// Define some URL routes
			"": "default",
			":p": 'showPage',

		},
		showPage: function( pageName, start ) {
			//load the menu
			var router = this;
			var menu = new Menu({page: pageName});
			$('.menu-wrapper').html(menu.render().el);
			var page = new Page({page: pageName,router: router});
			var pageHtml = page.render().el;

			

			$('.pages').append( pageHtml );
			
			//if multiple pages exist, the transition needs to happen
		
			if ($('.pages .page').length > 1) {
				var $firstPage = $('.pages .page:first'),
					$lastPage  = $('.pages .page:last');

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
				}
			

				$lastPage.css({position:'absolute',top: '90px'});
				
				$lastPage.show('slide', {direction: direction.in });
				$firstPage.hide('slide',{direction: direction.out });
				setTimeout(function(){
					$firstPage.parent().parent().remove();
					console.log('last',$lastPage)
					$lastPage.css({position:'relative',top: '0px'});
				}, 350 );//350 is how long it takes to slide in/out

				

			}

			
			
		},
		//refactor pages later
		default: function() {
			this.showPage('home', 'start');
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
	
