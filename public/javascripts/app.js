/*globals $,Backbone, window, document, cwidth*/
//This file loads the main app with the bootstrap daata
//and router
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'router',
	'collections/pages',
	'collections/projects',
	'text!templates/home.html',
	'text!templates/about.html',
	'text!templates/projects.html',
	'text!templates/projects/tinymce-thumbnail-gallery.html',
	'text!templates/projects/westchester-square.html',
	'text!templates/projects/mobilebox.html',
	'text!templates/projects/intrade.html',
	'text!templates/projects/westhost-php-contest.html'
], function( $, _, Backbone, Router, PagesCollection, ProjectCollection, 
			homePageTemplate, aboutPageTemplate, projectPageTemplate,
			tinyMceThumbnail, westchesterSquare, mobileBox, intrade, westhostPHPContest  ){
	var initialize = function(){
			
			///load all the pages
			var pages = new PagesCollection();

			//home page
			pages.add({name:'home',template: homePageTemplate});

			//about page
			pages.add({name:'about', template: aboutPageTemplate});

			//Projects on project page
			var projectCollection = new ProjectCollection();
				
				projectCollection.add({
					className:'page-tinymce-thumbnail-gallery',
					html: tinyMceThumbnail
				});
				projectCollection.add({
					className: 'page-westchester-square',
					html: westchesterSquare
				});
				projectCollection.add({
					className: 'page-mobilebox',
					html: mobileBox
				});
				projectCollection.add({
					className: 'page-intrade',
					html: intrade
				});	
				projectCollection.add({
					className: 'page-westhost-php-contest',
					html: westhostPHPContest
				});

				if (typeof subPage !== 'undefined') {
					projectCollection.getProjectByURLHash(subPage).set('active', true);
				}
			
			pages.add({name:'projects',template: projectPageTemplate, projects: projectCollection});//change projects to subPages
			

			var options = {};

			options.pages = pages;

		// Pass in our Router module and call it's initialize function
		Router.initialize(options);
	};

	return {
		initialize: initialize
	};
});

