
define(['jQuery', 
		'Underscore', 
		'Backbone',
		'views/menu',
		'text!templates/home.html',
		'text!templates/about.html',
		'text!templates/projects.html'

], function( $, _, Backbone, Menu, homePageHtml, aboutPageHtml, projectPageHtml) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;
			this.router = options.router;
		},
		events: {

		},
		getTemplate: function( ){
			var $template;
			switch(this.page) {
				case 'home':
					$template = $(homePageHtml);
					break;
				case 'about':
					$template = $(aboutPageHtml);
					break;
				case 'projects':
					$template = $(projectPageHtml);
					break;
			}

			var menu = new Menu({page: this.page});
			$('.container', $template).prepend(menu.render().el);
			
			$template.wrap('<div class="someclass" />');
			
			return _.template($template.html());

			
		},
		render: function() {
			var router = this.router;
			var template = this.getTemplate();
			this.$el.html( template() );
			$('a',this.$el).click(function(){
				var url = $(this).attr('href');
				router.navigate(url, true);
				return false;
			});
			return this;
		}
	});

	return Page;
});	