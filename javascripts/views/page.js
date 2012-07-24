
define(['jQuery', 
		'Underscore', 
		'Backbone', 
		'text!templates/home.html',
		'text!templates/about.html',
		'text!templates/projects.html'

], function( $, _, Backbone, homePageHtml, aboutPageHtml, projectPageHtml) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;
		},
		events: {

		},
		getTemplate: function( ){

			switch(this.page) {
				case 'home':
					return _.template(homePageHtml);
					break;
				case 'about':
					return _.template(aboutPageHtml);
					break;
				case 'projects':
					return _.template(projectPageHtml);
					break;
			}

			throw new Error('Page template not found');
		},
		render: function() {
			
			var template = this.getTemplate();
			this.$el.html( template() );
			return this;
		}
	});

	return Page;
});	