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
		'Raphael'
], function( $, _, Backbone, Menu, meTemplate, inceptionTemplate, simplicityTemplate, thdDotIsMeTemplate, globals, Raphael ) {

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

			return this;
		},
		renderRaphael: function() {
			var self = this;
			$('.raphael-canvas').html('');
			var paper = new Raphael($('.raphael-canvas').get(0));

			// Creates circle at x = 50, y = 40, with radius 10
			var circle = paper.circle(50, 50, 10);
			// Sets the fill attribute of the circle to red (#f00)
			circle.attr({fill: '#a23a35',stroke:'none'});
			
			circle.click(function(){
				var html = _.toArray(self.redDots)[self.redDotIndex],
					key  = _.keys(self.redDots)[self.redDotIndex];

				globals.clickCount++;
				_gaq.push(['_trackPageview', 'red-dot' + '/' + key ]);

				html = _.template(html, {clickCount: globals.clickCount});
				$('.red-dot-text').html(html);
				if ( (self.redDotIndex +1) === _.toArray(self.redDots).length) {
					self.redDotIndex = 0;
				} else {
					self.redDotIndex++;
				}
				
			});
			circle.hover(function(){
				this.attr({cursor:'pointer'});
				this.animate({r:13}, 1000, 'elastic');
				
			},
			function(){
				this.animate({r:10}, 1000, 'elastic');
			});

		}
	});

	return Page;
});