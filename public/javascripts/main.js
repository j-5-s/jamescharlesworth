
(function(){

	'use strict';

	var root = this,
		require = root.require;

	var scriptsLoaded = 0,
		scriptsToLoad = 37;

	//currently 37	

	//fake 'has' if it's not available
	var has = root.has = root.has || function() {
		return false;
	};

	require.config({
		paths: {
			domReady: 'domReady',
			jQuery: './vendor/jquery/jquery',
			jQueryUI: './vendor/jquery/jquery-ui-1.8.21.custom.min',
			Underscore: './vendor/underscore/underscore',
			Backbone: './vendor/backbone/backbone',
			templates: './templates'
		},
		waitSeconds: has('prod') ? 200 : 2,
		shim: {
			'Backbone': {
				//These script dependencies should be loaded before loading
				//backbone.js
				deps: ['Underscore', 'jQuery'],
				//Once loaded, use the global 'Backbone' as the
			},
			'jQueryUI': {
				deps: ['jQuery']
			}
		}

	});

	//this requires dom ready to update on ui, so this function expression
	//will be implemented later when domReady.
	var updateModuleProgress = function(context, map, depMaps) {
		//when dom is not ready, do something more useful?
		scriptsLoaded++;
		var console = root.console;
		if (console.log) {
			console.log('loading: ' + map.name + ' at ' + map.url);
		}
	};



	require.onResourceLoad = function(context, map, depMaps) {

		updateModuleProgress(context, map, depMaps);
	};	

	require(['domReady'], function(domReady) {
		var increment = -480;
		domReady(function() {
		//re-implement updateModuleProgress here for domReady
			updateModuleProgress = function(context, map, depMaps) {
				var document = root.document;
				
				var loaderBox = document.getElementById('loaderBox');

				scriptsLoaded++;

				if (loaderBox) { 
					var pos = 1 * loaderBox.style.backgroundPosition.split("px")[0];

					
					increment = increment + 11.20;
					loaderBox.style.backgroundPosition = increment + 'px' 
				}

				if (scriptsLoaded === scriptsToLoad) {
					var jsloader = document.getElementById('jsloader');
					jsloader.parentNode.removeChild(jsloader);
				}


			};
		});
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

}).call(this);