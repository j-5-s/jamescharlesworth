
define(['jQuery', 
		'Underscore', 
		'Backbone', 
		'text!templates/menu.html'

], function( $, _, Backbone, menuHTML ) {

	var Menu = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;
			this.router = options.router;
			_.bindAll(this, 'bindToLink', 'render')
		},
		events: {
			'click a': 'bindToLink'
		},
		render: function() {
			var template = _.template(menuHTML),
				router   = this.router;

			this.$el.html( template({page: this.page}) );

			return this;
		},
		bindToLink: function(e) {
			e.preventDefault();

			var url = $(e.currentTarget).attr('href');
			
			//in ie compatibility view it appends the url
			//need to refactor this in about and projects
			if (url.indexOf('http://jamescharlesworth.com/') !== -1) {
				var splited = url.split('http://jamescharlesworth.com/');
				url = splited[1];
			}
			this.router.navigate(url, true);

		}
	});

	return Menu;
});	