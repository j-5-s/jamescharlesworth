/*globals Raphael, _gaq */
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'text!templates/home/red-dot/me.html',
		'text!templates/home/red-dot/inception.html',
		'text!templates/home/red-dot/simplicity.html',
		'text!templates/home/red-dot/the-dot-is-me.html',
		'globals',
		'Raphael',
		'mantle'
], function( $, _, Backbone, Menu, meTemplate, inceptionTemplate, simplicityTemplate, thdDotIsMeTemplate, globals, Raphael, mantle ) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.router = options.router;
			this.redDots = {
				'who-am-i': meTemplate,
				'inception': inceptionTemplate,
				'simplicity': simplicityTemplate,
				'dot-is-me':thdDotIsMeTemplate
			};
			this.redDotIndex = 1;
		},
		id: 'home',
		className: 'home page',
		events: {

		},
		render: function() {
			var router   = this.router;

			this.$el.html( this.model.get('template') );
			var menu = new Menu({page: this.model.get('name'), router: router });
			$('.container', this.$el).prepend(menu.render().el);
			$('.below-fold a', this.$el).click(function(e){
				e.preventDefault();

				var url = $(e.currentTarget).attr('href');

				//in ie compatibility view it appends the url
				//need to refactor this in about and projects
				if (url.indexOf('http://jamescharlesworth.com/') !== -1) {
					var splited = url.split('http://jamescharlesworth.com/');
					url = splited[1];
				}
				router.navigate(url, true);

			});

			return this;
		},
		renderRaphael: function() {
			mantle.createPaper();
			mantle.paint(this);
		}
	});

	return Page;
});