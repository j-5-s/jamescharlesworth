/*globals document */
(function(){

	'use strict';

	require.config({
		paths: {
			jQuery: './vendor/jquery/jquery',
			jQueryNoSpam: './vendor/jquery/jquery.nospam',
			jqueryTipsy: './vendor/jquery/jquery.tipsy',
			Underscore: './vendor/underscore/underscore',
			Backbone: './vendor/backbone/backbone',
			eve: './vendor/raphaeljs/eve',
			Raphael: './vendor/raphaeljs/raphael.amd',
			templates: './templates'
		},
		shim: {
			'Backbone': {
				//These script dependencies should be loaded before loading
				//backbone.js
				deps: ['Underscore', 'jQuery']
				//Once loaded, use the global 'Backbone' as the
			},
			'jQueryNoSpam': {
				deps: ['jQuery']
			},
			'Raphael': {
				deps: ['eve']
			}
		}
	});

	require([
		'app',
		'jQuery'
	], function( App, $ ){
		$(function(){
			App.initialize();
		});
	});

}.call(this));