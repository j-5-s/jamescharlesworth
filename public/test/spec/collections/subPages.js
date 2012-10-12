describe('Collection :: SubPages', function() {
	beforeEach(function() {
		var flag = false,
			that = this;

		require(['collections/pages','collections/subPages'], function(PagesCollection, SubPagesCollection) {

			var pages = new PagesCollection();

			var projectCollection = new SubPagesCollection();

			projectCollection.add({
				className:'page-tinymce-thumbnail-gallery',
				html: ''
			});
			pages.add({name:'projects', subPages: projectCollection,template:''});
			// that.view = new View({collection: that.todos});
			// that.mockData = { title: 'Foo Bar', timestamp: new Date().getTime() };
			that.pages = pages;
			// $('#sandbox').html(that.view.render().el);
			flag = true;
		});
		waitsFor(function() {
			return flag;
		});
	});

	it('should contain one page', function(){
		expect(this.pages.length).toEqual(1);
	});

	it('should set active and return the active page', function(){
		var subPages = this.pages.at(0).get('subPages')
		var subPage = subPages.at(0);
		subPages.setActive(subPage);

		var activePage = subPages.getActiveSubPage();
		expect(activePage.get('active')).toEqual(true);
		expect(subPage).toEqual(activePage);

		//getIndex
		expect(subPages.getIndex(subPage)).toEqual(0);

		//getSubPageByURLHash
		expect(subPages.getSubPageByURLHash('tinymce-thumbnail-gallery')).not.toBeUndefined();

		//getSubPageClasses
		expect(subPages.getSubPageClasses()).toEqual(['page-tinymce-thumbnail-gallery']);
	});

});