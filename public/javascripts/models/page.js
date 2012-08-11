
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
		renderPageView: function( router ) {
			var view, el;
			if (this.get('name') === 'home') {
				view = new HomeView({model: this, router: router});
				console.log($(view.$el))
				view.$el.css({'-webkit-transform': 'rotateY(0deg) translateZ('+(globals.pageWidth/3.45)+'px)'});
		
			}

			if (this.get('name') === 'about') {
				view = new AboutView({model: this, router: router});
				view.$el.css({'-webkit-transform': 'rotateY(120deg) translateZ('+(globals.pageWidth/3.45)+'px)'});
			}

			if (this.get('name') === 'projects') {
				view = new ProjectsView({model: this, router: router});
				el = view.render().el
				view.$el.css({'-webkit-transform': 'rotateY(240deg) translateZ('+(globals.pageWidth/3.45)+'px)'});
			
			}			

		


			return view.render().el;
		}

	});

	return Page;
});