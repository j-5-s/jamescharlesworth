
define(['jQuery', 
		'Underscore', 
		'Backbone', 
		'text!templates/menu.html'

], function( $, _, Backbone, menuHTML ) {

	var Menu = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;


		},
		events: {

		},
		render: function() {
			var template = _.template(menuHTML),
				router   = this.router;

			this.$el.html( template({page: this.page}) );

			return this;
		},

	});

	return Menu;
});	