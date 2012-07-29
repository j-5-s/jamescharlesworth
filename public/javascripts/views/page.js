
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

			_.bindAll(this, 'render', 'scrollContent', 'changeSubPage', 'getActiveProjectPageClass' );
		},
		events: {
			'click .scroll': 'scrollContent'
		},
		getTemplate: function( ){
			var self = this,
				$template,
				page,
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
					if (typeof this.model.get('subPage') === 'undefined') {
						page = this.model.get('projects').at(0);
						console.log(this.model.get('projects').at(0),'projects')
						activeIndex = 0;
					} else {
						page = this.model.get('projects').filter(function(p){
							var re = new RegExp(self.model.get('subPage') +'$');
							return re.test(p.get('pageClass'));
						});
						var pageClasses = this.model.get('projects').pluck('pageClass');

						if (page.length > 0) {
							page = page[0];
							activeIndex = pageClasses.indexOf(page.get('pageClass'));
						}  else {
							//@TODO, add default 404 page
						}
					}
					var totalPages = this.model.get('projects').length;
					
					$('.counter', $template).html( 'Project ' + (activeIndex+1) + ' of ' + totalPages );
					$('.project-content', $template).addClass(page.get('pageClass'));
					$('.project-content', $template).html(page.get('html'));
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
		getActiveProjectPageClass: function() {
			return _.filter($('.project-content').attr('class').split(' '),function(klass){
				return (/^page/).test(klass);
			})[0];
		},
		changeSubPage: function( params ){
			var pageClasses = this.model.get('projects').pluck('pageClass'),
				router      = this.router;


			var activePageClass = this.getActiveProjectPageClass(),
				activePageIndex = pageClasses.indexOf(activePageClass),
				totalPages      = pageClasses.length;
			
			var direction;

			if (params.direction === 'up') {
				direction = -1;
			} else {
				direction = 1;
			}

			if (( activePageIndex + direction ) < totalPages && activePageIndex + direction >= 0) {
				var nextPage = this.model.get('projects').at( activePageIndex + direction );

				$('.'+activePageClass).fadeOut(300, function(){
					$('.'+activePageClass).html(nextPage.get('html'));
					$('.'+activePageClass).addClass(nextPage.get('pageClass'));
					$('.'+activePageClass).fadeIn(300);
					$('.'+activePageClass).removeClass(activePageClass);
					
					//turn page-<name> into <name>
					var url = /\w+\-(.*)/.exec(nextPage.get('pageClass'))[1];
					
					//update the counter
					$('.counter').html( 'Project ' + (activePageIndex + direction +1) + ' of ' + totalPages );

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