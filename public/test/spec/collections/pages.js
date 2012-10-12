describe('Collection :: Pages', function() {
	beforeEach(function() {
		var flag = false,
			that = this;

		require(['collections/pages'], function(PagesCollection) {
			that.PagesCollection = PagesCollection;
			// that.view = new View({collection: that.todos});
			// that.mockData = { title: 'Foo Bar', timestamp: new Date().getTime() };
			// $('#sandbox').html(that.view.render().el);
			flag = true;
		});
		waitsFor(function() {
			return flag;
		});
	});

	it('should contain one item', function(){
		var pages = new this.PagesCollection();
		pages.add({name:'home'});
		expect(pages.length).toEqual(1);
	});

	it('should have the name `home`', function(){
		var pages = new this.PagesCollection();
		pages.add({name:'home'});
		var page = pages.getByName('home');
		expect(page.get('name')).toEqual('home');
	});
});