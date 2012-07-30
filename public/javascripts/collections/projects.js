define(['jQuery',
		'Underscore',
		'Backbone',
		'models/project'
], function( $, _, Backbone, ProjectModel ) {

	var ProjectCollection = Backbone.Collection.extend({
		initialize: function() {

		},
		model: ProjectModel,

		getActiveProject: function() {
			var activeProject = this.find(function( projectModel ){
				return projectModel.get('active');
			});
			if (!activeProject) {
				activeProject = this.at(0);
			}
			return activeProject;
		},
		getActiveProjectIndex: function() {
			var activeProject = this.getActiveProject();
			return this.getIndex(activeProject);
		},
		getProjectByURLHash: function( urlHash ){
			var project = this.find(function(p){
				var re = new RegExp( urlHash +'$');
				return re.test(p.get('className'));
			});
			return project;
		},
		getProjectClasses: function(){
			return this.pluck('className');	
		},

		getIndex: function( model ){
			var classNamees = this.getProjectClasses();
			return classNamees.indexOf(model.get('className'));
		},
		setActive: function( model ){
			var activeProject = this.getActiveProject();
			if (activeProject) {
				activeProject.set('active', false);
			}
			model.set('active',true);
		},

	});

	return ProjectCollection;
});		