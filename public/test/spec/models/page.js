describe('Models :: Page', function() {
	var r ;
	beforeEach(function() {
		var flag = false,
			that = this;


		require(['collections/pages','collections/subPages','models/page', 'router','text!templates/projects.html'],
				function(PagesCollection, SubPagesCollection, PageModel, Router, projectsTemplate) {
			that.PagesCollection = PagesCollection;
			that.PageModel = PageModel;
			that.Router = Router;

			var pages = new PagesCollection();

			var projectCollection = new SubPagesCollection();

			projectCollection.add({
				className:'page-tinymce-thumbnail-gallery',
				html: '<h1 id="modelPageTest">works</h1>'
			});
			pages.add({name:'projects', subPages: projectCollection,template:projectsTemplate});
			// that.view = new View({collection: that.todos});
			// that.mockData = { title: 'Foo Bar', timestamp: new Date().getTime() };
			that.pages = pages;

			var options = {
				pages: pages
			};

			// Pass in our Router module and call it's initialize function
			if (typeof r === 'undefined') {
				r = that.Router.AppRouter
			}


			flag = true;
		});
		waitsFor(function() {
			return flag;
		});
	});

	it('should have sub pages', function(){
		var pages= this.pages,
			page = pages.at(0);
		expect(page.hasSubPages()).toBeTruthy();
	});

	it('should render view', function(){
		var pages= this.pages,
			page = pages.at(0);


		var appRouter = new r({pages:pages});
		Backbone.history.start({pushState:true});
		var view = page.renderPageView( appRouter, 'projects', 'tinymce-thumbnail-gallery' ) ;
		expect($(view).find('#modelPageTest').html()).toEqual('works');

	});

});