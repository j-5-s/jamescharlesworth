
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'text!templates/home.html',
		'text!templates/about.html',
		'text!templates/projects.html',
		'text!templates/projects/tinymce-thumbnail-gallery.html',
		'text!templates/projects/westchester-square.html',
		'text!templates/projects/mobilebox.html',
		'text!templates/projects/intrade.html',
		'text!templates/projects/westhost-php-contest.html'
], function( $, _, Backbone, Menu, homePageHtml, aboutPageHtml, projectPageHtml, 
			tinyMceThumbnail, westchesterSquare, mobileBox, intrade, westhostPHPContest) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;
			this.subPage = options.subPage;
			this.router = options.router;
			this.projects = [
				{
					pageClass:'page-tinymce-thumbnail-gallery',
					html: tinyMceThumbnail,
				},
				{
					pageClass: 'page-westchester-square',
					html: westchesterSquare
				},
				{
					pageClass: 'page-mobilebox',
					html: mobileBox
				},
				{
					pageClass: 'page-intrade',
					html: intrade
				},
				{
					pageClass: 'page-westhost-php-contest',
					html: westhostPHPContest
				}				
			];
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

			switch(this.page) {
				case 'home':
					$template = $(homePageHtml);
					break;
				case 'about':
					$template = $(aboutPageHtml);
					break;
				case 'projects':
					$template = $(projectPageHtml);
					//find the project if there is a sub page,if not default to 0
					if (typeof this.subPage === 'undefined') {
						page = this.projects[0];
						activeIndex = 0;
					} else {
						page = _.filter(this.projects, function(p){
							var re = new RegExp(self.subPage +'$');
							return re.test(p.pageClass);
						});
						var pageClasses = _.pluck(this.projects, 'pageClass');

						if (page.length > 0) {
							page = page[0];
							activeIndex = pageClasses.indexOf(page.pageClass);
						}  else {
							//@TODO, add default 404 page
						}
					}
					var totalPages = this.projects.length;
					
					$('.counter', $template).html( 'Project ' + (activeIndex+1) + ' of ' + totalPages );
					$('.project-content', $template).addClass(page.pageClass);
					$('.project-content', $template).html(page.html);
					break;
			}

			var menu = new Menu({page: this.page});
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
			var pageClasses = _.pluck(this.projects, 'pageClass'),
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
				var nextPage = this.projects[ (activePageIndex + direction) ];

				$('.'+activePageClass).fadeOut(300, function(){
					$('.'+activePageClass).html(nextPage.html);
					$('.'+activePageClass).addClass(nextPage.pageClass);
					$('.'+activePageClass).fadeIn(300);
					$('.'+activePageClass).removeClass(activePageClass);
					
					//turn page-<name> into <name>
					var url = /\w+\-(.*)/.exec(nextPage.pageClass)[1];
					
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