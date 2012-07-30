
define(['jQuery',
		'Underscore',
		'Backbone'
], function( $, _, Backbone ) {

	var Page = Backbone.Model.extend({
		setActive: function(project) {
			//update projects (name) later
			if (this.get('projects')) {
			//	this.get('projects').setActive()
			}
		}
	});

	return Page;
});