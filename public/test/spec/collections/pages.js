describe('Collection :: Pages', function() {
	beforeEach(function() {
		var flag = false,
			that = this;

		require(['collections/pages'], function(PagesCollection) {
			that.PagesCollection = new PagesCollection();
			// that.view = new View({collection: that.todos});
			// that.mockData = { title: 'Foo Bar', timestamp: new Date().getTime() };
			// $('#sandbox').html(that.view.render().el);
			flag = true;
		});
		waitsFor(function() {
			return flag;
		});
	});

	it('should run', function(){
		//var pages = new PagesCollection();
		console.log(this.PagesCollection);
		expect('a').toEqual('a');
	});
});