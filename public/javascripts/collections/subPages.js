define(['jQuery',
		'Underscore',
		'Backbone',
		'models/subPage'
], function( $, _, Backbone, subPageModel ) {

	var subPagesCollection = Backbone.Collection.extend({
		initialize: function() {

		},
		model: subPageModel,

		getActiveSubPage: function() {
			var activeSubPage = this.find(function( subPageModel ){
				return subPageModel.get('active');
			});

			if (!activeSubPage) {
				activeSubPage = this.at(0);
			}
			return activeSubPage;
		},
		getActiveSubPageIndex: function() {
			var activeSubPage = this.getActiveSubPage();
			return this.getIndex(activeSubPage);
		},
		getIndex: function( model ){
			var classNames = this.getSubPageClasses();
			return _.indexOf(classNames, model.get('className'));
		},
		getSubPageByURLHash: function( urlHash ){
			var subPage = this.find(function(p){
				var re = new RegExp( urlHash +'$');
				return re.test(p.get('className'));
			});
			return subPage;
		},		
		getSubPageClasses: function(){
			return this.pluck('className');	
		},		
		setActive: function( model ){
			var activeSubPage= this.getActiveSubPage();
			if (activeSubPage) {
				activeSubPage.set('active', false);
			}
			model.set('active',true);
		}

	});

	return subPagesCollection;
});		