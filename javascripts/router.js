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

			if (typeof start === 'undefined') {
				$('.pages .page:last').css({position:'absolute',top: '90px',display:'none'});
				
				$('.pages .page:last').show('slide', {direction:'left'})
				$('.pages .page:first').hide('slide',{direction:'right'})
				setTimeout(function(){
					$('.pages .page:first').remove();
				},1000);	
			}

			
			
		},
		//refactor pages later
		default: function() {
			this.showPage('home', 'start');
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
	
