
define(['jQuery', 
		'Underscore', 
		'Backbone',
		'views/menu',
		'text!templates/home.html',
		'text!templates/about.html',
		'text!templates/projects.html',
		'text!templates/projects/tinymce-thumbnail-gallery.html',
		'text!templates/projects/westchester-square.html'
], function( $, _, Backbone, Menu, homePageHtml, aboutPageHtml, projectPageHtml, tinyMceThumbnail, westchesterSquare) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.page = options.page;
			this.router = options.router;
			this.projects = [
				{ 
					pageClass:'page-tinymce-thumbnail-gallery',
					html: tinyMceThumbnail, 
				},
				{	
					pageClass: 'page-westchester-square',
					html: westchesterSquare
				}	
			];
			_.bindAll(this, 'render', 'scrollContent', 'scrollDown', 'scrollUp', 'getActiveProjectPageClass' );
		},
		events: {
			'click .scroll': 'scrollContent'
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
					$('.project-content', $template).addClass(this.projects[0].pageClass);
					$('.project-content', $template).html(this.projects[0].html );
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
				this.scrollDown($el);
			} else {
				this.scrollUp($el);
			}
		},
		getActiveProjectPageClass: function() {
			return _.filter($('.project-content').attr('class').split(' '),function(klass){
				return /^page/.test(klass);
			})[0];
		},
		scrollDown: function(){
			var pageClasses = _.pluck(this.projects, 'pageClass');

			var activePageClass = this.getActiveProjectPageClass(),
				activePageIndex = pageClasses.indexOf(activePageClass),
				activePage      = this.projects[activePageIndex],
				totalPages      = pageClasses.length;
			
			if ((activePageIndex+1) < totalPages) {
				var nextPage = this.projects[(activePageIndex+1)];
				$('.'+activePageClass).fadeOut(300, function(){
					$('.'+activePageClass).html(nextPage.html);
					$('.'+activePageClass).addClass(nextPage.pageClass);
					$('.'+activePageClass).fadeIn(300)
					$('.'+activePageClass).removeClass(activePageClass);					
				});




			}
			
			
		},
		scrollUp: function() {
			alert('up')
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