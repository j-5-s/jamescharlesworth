
define(['jQuery', 
		'Underscore', 
		'Backbone', 
		'text!templates/menu.html'

], function( $, _, Backbone, menuHTML ) {

	var Menu = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;

			_.bindAll(this, 'render','bindToLink');
		},
		events: {
			'a .click': 'bindToLink'
		},
		render: function() {
			var template = _.template(menuHTML),
				router   = this.router;

			this.$el.html( template({page: this.page}) );

			return this;
		},
		bindToLink: function(e) {

			var url = $(e.currentTarget).attr('href');
			this.router.navigate(url, true);
			return false;
		}

	});

	return Menu;
});	