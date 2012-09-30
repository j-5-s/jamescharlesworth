
require.config({
	baseUrl: "/javascripts/",
	urlArgs: 'cb=' + Math.random(),
	paths: {
		jQuery: 'vendor/jquery/jquery',
		Underscore: 'vendor/underscore/underscore',
		Backbone: 'vendor/backbone/backbone',
		//'backbone.localStorage': 'lib/backbone.localStorage',
		jasmine: '../test/jasmine/lib/jasmine-core/jasmine',
		'jasmine-html': '../test/jasmine/lib/jasmine-core/jasmine-html',
		spec: '../test/jasmine/spec/',
		eve: './vendor/raphaeljs/eve',
		Raphael: './vendor/raphaeljs/raphael.amd'

	},
  shim: {
	Underscore: {
		exports: "_"
	},
	Backbone: {
		deps: ['Underscore', 'jQuery'],
		exports: 'Backbone'
	},
	// 'backbone.localStorage': {
	//   deps: ['backbone'],
	//   exports: 'Backbone'
	// },
	jasmine: {
		exports: 'jasmine'
	},
	'jasmine-html': {
		deps: ['jasmine'],
		exports: 'jasmine'
	}
  }
});


//window.store = "TestStore"; // override local storage store name - for testing

require(['Underscore', 'jQuery', 'jasmine-html'], function(_, $, jasmine){


	var jasmineEnv = jasmine.getEnv();
	jasmineEnv.updateInterval = 1000;

	var htmlReporter = new jasmine.HtmlReporter();

	jasmineEnv.addReporter(htmlReporter);

	jasmineEnv.specFilter = function(spec) {
		return htmlReporter.specFilter(spec);
	};

	var specs = [];

	 specs.push('../test/spec/collections/pages');
	// specs.push('spec/views/ClearCompletedSpec');
	// specs.push('spec/views/CountViewSpec');
	// specs.push('spec/views/FooterViewSpec');
	// specs.push('spec/views/MarkAllSpec');
	// specs.push('spec/views/NewTaskSpec');
	// specs.push('spec/views/TaskListSpec');
	// specs.push('spec/views/task/TaskViewSpec');
	// specs.push('spec/views/task/ViewTaskViewSpec');
	// specs.push('spec/views/task/EditTaskViewSpec');


	$(function(){
		require(specs, function(){
			jasmineEnv.execute();
		});
	});

});
