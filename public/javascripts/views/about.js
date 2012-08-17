
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'globals',
		'swiper'
], function( $, _, Backbone, Menu, globals, swiper) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.router = options.router;
		},
		id: 'about',
		className: 'about page',
		events: {
			
		},
		render: function() {
			var router = this.router;
			
			this.$el.html( this.model.get('template') );

			var menu = new Menu({page: this.model.get('name'), router:router });
			$('.container', this.$el).prepend(menu.render().el);


			return this;
		}
	});

	return Page;
});