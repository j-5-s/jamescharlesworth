
/*globals document */
(function(){

	'use strict';

	var root = this,
		require = root.require;

	var scriptsLoaded = 0,
		scriptsToLoad = 42;

	//fake 'has' if it's not available
	var has = root.has = root.has || function() {
		return false;
	};

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
		waitSeconds: has('prod') ? 200 : 2,
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
		// Load our app module and pass it to our definition function
		'app',
		// Some plugins have to be loaded in order due to their non AMD compliance
		// Because these scripts are not "modules" they do not pass any values to the definition function below
	], function( App ){
	
		// The "app" dependency is passed in as "App"
		// Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
		App.initialize();

	});

}.call(this));