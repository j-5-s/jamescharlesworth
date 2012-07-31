
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
		},
		hasSubPages: function() {
			if (this.get('subPages')) {
				return true;
			} else {
				return false;
			}
		}
	});

	return Page;
});