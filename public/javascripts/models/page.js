
define(['jQuery',
		'Underscore',
		'Backbone'
], function( $, _, Backbone ) {

	var Page = Backbone.Model.extend({
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