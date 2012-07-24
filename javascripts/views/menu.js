
define(['jQuery', 
		'Underscore', 
		'Backbone', 
		'text!templates/menu.html'

], function( $, _, Backbone, menuHTML ) {

	var Menu = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;
			this.router = options.router;

		},
		events: {

		},
		render: function() {
			var template = _.template(menuHTML),
				router   = this.router;

			this.$el.html( template({page: this.page}) );
			$('a',this.$el).click( function(){
				var url = $(this).attr('href');

				router.navigate(url,true);
				return false;
			});
			return this;
		},

	});

	return Menu;
});	