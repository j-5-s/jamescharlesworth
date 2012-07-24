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
		showPage: function( pageName ) {
			//load the menu
			
			var menu = new Menu({page: pageName, router: this});
			$('.menu-wrapper').html(menu.render().el);
			var page = new Page({page: pageName});
			$('.pages').children(':first').remove();
			$('.pages').html(page.render().el);
			console.log($('.pages').children(':first'))
			$('.pages').children(':first').animate({
				//'margin-left': '-=1000px'
			}, function(){
				console.log('done')
			})

			
				



			
			
		},
		//refactor pages later
		default: function() {
			this.showPage('home');
		}
	});

	
	var initialize = function(options){
		var appRouter = new AppRouter(options);
		Backbone.history.start({pushState:true, root:'/jamescharlesworth/'});
	};

	return {

		initialize: initialize
	};
});
	
