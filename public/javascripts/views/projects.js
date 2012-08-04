/*globals Raphael */
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'text!templates/projects/intrade.html',
		'text!templates/projects/mobile-box.html',
		'text!templates/projects/tinymce-thumbnail-gallery.html',
		'text!templates/projects/westchester-square.html',
		'text!templates/projects/westhost-php-contest.html',
		'globals'
], function( $, _, Backbone, Menu, meTemplate, inceptionTemplate, simplicityTemplate, thdDotIsMeTemplate, globals) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.router = options.router;
			this.subPages = this.model.get('subPages');
			_.bindAll(this, 'render', 'scrollContent', 'changeSubPage' );
		},
		events: {
			'click .scroll': 'scrollContent'
		},
		getTemplate: function( ){
			var $template = $(this.model.get('template'));

				//find the subPage if there is a sub page,if not default to 0
				//the page has subpages, but one is not sellected
				var activeSubPage = this.subPages.getActiveSubPage(),
					activeIndex   = this.subPages.getIndex(activeSubPage);

				
				var totalPages = this.subPages.length;
				
				$('.counter', $template).html( 'Project ' + (activeIndex+1) + ' of ' + totalPages );
				$('.project-content', $template).addClass(activeSubPage.get('className'));
				$('.project-content', $template).html(activeSubPage.get('html'));
			
			
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
			var subPageClasses = this.subPages.getSubPageClasses(),
				router      = this.router;


			var activeSubPage   = this.subPages.getActiveSubPage(), 
				activeclassName = activeSubPage.get('className'),
				activePageIndex = this.subPages.getIndex( activeSubPage ),
				totalSubPages   = subPageClasses.length;

			var direction;

			if (params.direction === 'up') {
				direction = -1;
			} else {
				direction = 1;
			}

			//make sure the next page is both greater than zero and less than
			//the total pages			
			if (( activePageIndex + direction ) <= totalSubPages && activePageIndex + direction >= 0) {
				
				var nextSubPage = this.model.get('subPages').at( activePageIndex + direction );
				//setActive will deactivate current active and active subPage
				//passed into it
				this.subPages.setActive(nextSubPage);
				router.stylize();


				$('.'+activeclassName).fadeOut(300, function(){
					$('.'+activeclassName).html(nextSubPage.get('html'));
					$('.'+activeclassName).addClass(nextSubPage.get('className'));
					$('.'+activeclassName).fadeIn(300);
					$('.'+activeclassName).removeClass(activeclassName);
					
					//turn page-<name> into <name>
					var url = nextSubPage.getURLHash();
					
					//update the counter
					$('.counter').html( 'Project ' + (activePageIndex + direction +1) + ' of ' + totalSubPages );

					router.navigate('/projects/' + url, {replace:true} );

				});
			}
		},
		render: function() {
			var router   = this.router,
				template = this.getTemplate(),
				self     = this;
	

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