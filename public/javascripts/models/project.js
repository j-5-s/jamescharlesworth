
define(['jQuery',
		'Underscore',
		'Backbone'
], function( $, _, Backbone ) {

	var Project = Backbone.Model.extend({
		initialize: function() {
			this.set('active', false);
		},
		getURLHash: function() {
			return  /\w+\-(.*)/.exec(this.get('className'))[1];
		},
	});

	return Project;
});