
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/about',
		'views/home',
		'views/projects'
], function( $, _, Backbone, AboutView, HomeView, ProjectsView ) {

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
		renderPageView: function( router ) {
			var view;
			if (this.get('name') === 'home') {
				view = new HomeView({model: this, router: router});
			}

			if (this.get('name') === 'about') {
				view = new AboutView({model: this, router: router});
			}

			if (this.get('name') === 'projects') {
				view = new ProjectsView({model: this, router: router});
			}			




			return view.render().el;
		}

	});

	return Page;
});