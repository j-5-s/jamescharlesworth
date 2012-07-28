require.config({
	paths: {
		jQuery: './vendor/jquery/jquery',
		jQueryUI: './vendor/jquery/jquery-ui-1.8.21.custom.min',
		Underscore: './vendor/underscore/underscore',
		Backbone: './vendor/backbone/backbone',
		templates: './templates'
	},
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