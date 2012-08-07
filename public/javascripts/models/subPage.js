
define(['jQuery',
		'Underscore',
		'Backbone'
], function( $, _, Backbone ) {

	var SubPage = Backbone.Model.extend({
		initialize: function() {
			this.set('active', false);
		},
		getURLHash: function() {
			return  /\w+\-(.*)/.exec(this.get('className'))[1];
		}
	});

	return SubPage;
});