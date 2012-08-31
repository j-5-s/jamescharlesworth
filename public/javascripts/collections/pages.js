define(['jQuery',
		'Underscore',
		'Backbone',
		'models/page'
], function( $, _, Backbone, PageModel ) {
	var PagesCollection = Backbone.Collection.extend({
		initialize: function() {

		},
		model: PageModel,
		getByName: function( pageName ) {
			return this.find(function(page){
				return page.get('name') === pageName ;
			});
		},
		setDegrees: function( pageName ) {
			this.each(function(page, index){
				if (pageName === page.get('name')) {
					page.set('deg', 0);
				}
			});
		}
	});

	return PagesCollection;
});