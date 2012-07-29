
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'text!templates/home.html',
		'text!templates/about.html',
		'text!templates/projects.html'
], function( $, _, Backbone, Menu, homePageHtml, aboutPageHtml, projectPageHtml ) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			
			
			this.router = options.router;
			this.projects = this.model.get('projects');
			_.bindAll(this, 'render', 'scrollContent', 'changeSubPage' );
		},
		events: {
			'click .scroll': 'scrollContent'
		},
		getTemplate: function( ){
			var self = this,
				$template,
				project,
				activeIndex;

			switch(this.model.get('name')) {
				case 'home':
					$template = $(homePageHtml);
					break;
				case 'about':
					$template = $(aboutPageHtml);
					break;
				case 'projects':
					$template = $(projectPageHtml);

					//find the project if there is a sub page,if not default to 0
					if (!this.model.get('subPage')) {
						project = this.projects.at(0);
						activeIndex = 0;
					} else {
						var project = this.projects.getProjectByURLHash(this.model.get('subPage'))

						if (project) {
							activeIndex = this.projects.getIndex(project);
						}  else {
							//@TODO, add default 404 page
						}
					}
					var totalPages = this.projects.length;
					
					$('.counter', $template).html( 'Project ' + (activeIndex+1) + ' of ' + totalPages );
					$('.project-content', $template).addClass(project.get('pageClass'));
					$('.project-content', $template).html(project.get('html'));
					break;
			}

			var menu = new Menu({page: this.model.get('name')});
			$('.container', $template).prepend(menu.render().el);
			
			$template.wrap('<div class="someclass" />');
			
			return $template.html();
		},
		scrollContent: function(e) {
			e.preventDefault();
			var $el = $(e.currentTarget);
			if ($el.hasClass('scroll-down')) {
				this.changeSubPage({direction: 'down', e: e});
			} else {
				this.changeSubPage({ direction: 'up', e: e});
			}
		},
		changeSubPage: function( params ){
			var projectClasses = this.projects.getProjectClasses(),
				router      = this.router;


			var activeProject   = this.projects.getActiveProject(), 
				activePageClass = activeProject.get('pageClass'),
				activePageIndex = this.projects.getIndex(activeProject),
				totalProjects   = projectClasses.length;


			
			var direction;

			if (params.direction === 'up') {
				direction = -1;
			} else {
				direction = 1;
			}
			//make sure 
			
			if (( activePageIndex + direction ) <= totalProjects && activePageIndex + direction >= 0) {
				var nextProject = this.model.get('projects').at( activePageIndex + direction );
				
				this.projects.setActive(nextProject);


				$('.'+activePageClass).fadeOut(300, function(){
					$('.'+activePageClass).html(nextProject.get('html'));
					$('.'+activePageClass).addClass(nextProject.get('pageClass'));
					$('.'+activePageClass).fadeIn(300);
					$('.'+activePageClass).removeClass(activePageClass);
					
					//turn page-<name> into <name>
					var url = nextProject.getURLHash();
					
					//update the counter
					$('.counter').html( 'Project ' + (activePageIndex + direction +1) + ' of ' + totalProjects );

					router.navigate('/projects/' + url, {replace:true} );

				});
			}
		},
		render: function() {
			var router = this.router;
			var template = this.getTemplate();
			this.$el.html( template );
			$('.menu a',this.$el).click(function(){
				var url = $(this).attr('href');
				router.navigate(url, true);
				return false;
			});

			return this;
		}
	});

	return Page;
});