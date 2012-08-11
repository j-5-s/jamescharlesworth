
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/about',
		'views/home',
		'views/projects',
		'globals'
], function( $, _, Backbone, AboutView, HomeView, ProjectsView, globals ) {

	var Page = Backbone.Model.extend({
		initialize: function(){
			_.bindAll(this, 'hasSubPages', 'renderPageView');
		},
		hasSubPages: function() {
			if (this.get('subPages')) {
				return true;
			} else {
				return false;
			}
		},

		renderPageView: function( router, pageName ) {
			var view, el;
			if (this.get('name') === 'home') {
				view = new HomeView({model: this, router: router});
				globals.transform(view.$el, 0)
				setTimeout(function(){
					view.renderRaphael();
				},200);		
			}

			if (this.get('name') === 'about') {
				view = new AboutView({model: this, router: router});
				globals.transform(view.$el, 120);

				
			}

			if (this.get('name') === 'projects') {
				view = new ProjectsView({model: this, router: router});
				el = view.render().el;
				globals.transform(view.$el, 240)
				
			
			}			
			//view.swiper(pageName);
			return view.render().el;
		}

	});

	return Page;
});