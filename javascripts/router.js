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
			console.log('what')
			//this.navigate('/home', true)
		},
		routes: {
			// Define some URL routes
			"": "default",
			"about": 'about',
			"projects": "projects"

		},
		//refactor pages later
		default: function() {
			//load the menu
			var menu = new Menu({page:'home', router: this});
			$('.menu-wrapper').html(menu.render().el);
			var page = new Page({page:'home'});
			$('.pages').html(page.render().el);
		},
		about: function() {
			var menu = new Menu({page:'about', router: this});
			$('.menu-wrapper').html(menu.render().el);			
			var page = new Page({page:'about'});
			$('.pages').html(page.render().el);
		},
		projects: function() {
			var menu = new Menu({page:'projects', router: this});
			$('.menu-wrapper').html(menu.render().el);			
			var page = new Page({page:'projects'});
			$('.pages').html(page.render().el);
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
	
