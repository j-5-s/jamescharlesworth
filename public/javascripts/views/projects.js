/*globals Raphael, _gaq */
define(['jQuery',
		'Underscore',
		'Backbone',
		'views/menu',
		'text!templates/projects/intrade.html',
		'text!templates/projects/mobile-box.html',
		'text!templates/projects/tinymce-thumbnail-gallery.html',
		'text!templates/projects/westchester-square.html',
		'text!templates/projects/westhost-php-contest.html',
		'globals',
		'swiper'
], function( $, _, Backbone, Menu, meTemplate, inceptionTemplate, simplicityTemplate, thdDotIsMeTemplate, phpContest, globals, swiper) {

	var Page = Backbone.View.extend({
		initialize: function( options ) {
			this.router = options.router;
			this.subPages = this.model.get('subPages');
			_.bindAll(this, 'render', 'scrollContent', 'changeSubPage' );
		},
		id: 'projects',
		className: 'projects page',
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
			globals.clickCount++;
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

			var self =this;

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
			if (( activePageIndex + direction ) < totalSubPages && activePageIndex + direction >= 0) {

				var nextSubPage = this.model.get('subPages').at( activePageIndex + direction );
				//setActive will deactivate current active and active subPage
				//passed into it
				this.subPages.setActive(nextSubPage);
		

				//GA anaytlics tracking
				var virtualPageview = 'projects/' + nextSubPage.getURLHash();
				_gaq.push(['_trackPageview', virtualPageview]);


				$('.'+activeclassName).fadeOut(300, function(){
					$('.'+activeclassName).html(nextSubPage.get('html'));
					$('.'+activeclassName).addClass(nextSubPage.get('className'));
					$('.project-content', self.$el).show();
					$('.'+activeclassName).removeClass(activeclassName);
					
					//turn page-<name> into <name>
					var url = nextSubPage.getURLHash();
					
					//update the counter
					$('.counter').html( 'Project ' + (activePageIndex + direction +1) + ' of ' + totalSubPages );

					router.navigate('/projects/' + url, {replace:true} );
					setTimeout(function(){
						router.stylize('projects');
					},300)
					

				});
			}
		},
		render: function() {
			var router   = this.router,
				template = this.getTemplate();
	
		
			this.$el.html( template );



			$('.menu a',this.$el).click(function(){
				var url = $(this).attr('href');
				//in ie compatibility view it appends the url
				if ( url.indexOf('http://jamescharlesworth.com/') !== -1 ) {
					var splited = url.split('http://jamescharlesworth.com/');
					url = splited[1];
				}				
				router.navigate(url, true);
				return false;
			});

			return this;
		},
		swiper: function() {
			var page = $('.page', this.el),
				router = this.router;
			
			swiper( page, function(direction){
				//swipe left
				
				if (direction > 0) {
					//nothing, im at the end
				} else {					
					router.navigate('about', {trigger:true});
				}
			});			
		}
	});

	return Page;
});