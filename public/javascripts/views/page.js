
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu'
], function( $, _, Backbone, Menu) {

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
			var self      = this,
				$template = $(this.model.get('template')),
				project,
				activeIndex;

			//need to refactor this out of here into app.js / templates
			if (this.model.get('name') === 'projects') { //fix later
				//find the project if there is a sub page,if not default to 0
				if (!this.model.get('subPage')) {
					project = this.projects.at(0);
					activeIndex = 0;
				} else {
					var project = this.projects.getProjectByURLHash(this.model.get('subPage'))
					//set this project as active
					this.projects.setActive(project);
					if (project) {
						activeIndex = this.projects.getIndex(project);
					}  else {
						//@TODO, add default 404 page
					}
				}
				var totalPages = this.projects.length;
				
				$('.counter', $template).html( 'Project ' + (activeIndex+1) + ' of ' + totalPages );
				$('.project-content', $template).addClass(project.get('className'));
				$('.project-content', $template).html(project.get('html'));
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
				this.changeSubPage({direction: 'down', e: e });
			} else {
				this.changeSubPage({ direction: 'up', e: e });
			}
		},
		changeSubPage: function( params ){
			//consider refactoring
			var projectClasses = this.projects.getProjectClasses(),
				router      = this.router;


			var activeProject   = this.projects.getActiveProject(), 
				activeclassName = activeProject.get('className'),
				activePageIndex = this.projects.getIndex( activeProject ),
				totalProjects   = projectClasses.length;

			var direction;

			if (params.direction === 'up') {
				direction = -1;
			} else {
				direction = 1;
			}

			//make sure the next page is both greater than zero and less than
			//the total pages			
			if (( activePageIndex + direction ) <= totalProjects && activePageIndex + direction >= 0) {
				
				var nextProject = this.model.get('projects').at( activePageIndex + direction );
				//setActive will deactivate current active and active project
				//passed into it
				this.projects.setActive(nextProject);


				$('.'+activeclassName).fadeOut(300, function(){
					$('.'+activeclassName).html(nextProject.get('html'));
					$('.'+activeclassName).addClass(nextProject.get('className'));
					$('.'+activeclassName).fadeIn(300);
					$('.'+activeclassName).removeClass(activeclassName);
					
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