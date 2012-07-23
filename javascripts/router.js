/*globals app, Backbone, $, resize*/
// Filename: router.js
define([
	'jQuery',
	'Underscore',
	'Backbone',

], function( $, _, Backbone ){

	var AppRouter = Backbone.Router.extend({
		initialize: function(options) {
			this.options = options;
		},
		routes: {
			// Define some URL routes
			"test":"test"
		},
		test: function() {
			alert('hello');
		}

	});
	
	var initialize = function(options){
		var appRouter = new AppRouter(options);
		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});
	
