/*globals $,Backbone, window, document, cwidth*/
//This file loads the main app with the bootstrap daata
//and router
define([
	'jQuery',
	'Underscore',
	'Backbone',
	'router',
	'collections/pages',
	'collections/subPages',
	'text!templates/home.html',
	'text!templates/home/red-dot/me.html',
	'text!templates/about.html',
	'text!templates/projects.html',
	'text!templates/projects/tinymce-thumbnail-gallery.html',
	'text!templates/projects/westchester-square.html',
	'text!templates/projects/mobile-box.html',
	'text!templates/projects/intrade.html',
	'text!templates/projects/westhost-php-contest.html'
], function( $, _, Backbone, Router, PagesCollection, SubPageCollection, 
			homePageTemplate, meHtml, aboutPageTemplate, projectPageTemplate,
			tinyMceThumbnail, westchesterSquare, mobileBox, intrade, westhostPHPContest  ){
	
	var initialize = function(){
			
			///load all the pages
			var pages = new PagesCollection();

			//home page
			var template = _.template(homePageTemplate, {redDot: meHtml});
			pages.add({name:'home',template: template});

			//about page
			pages.add({name:'about', template: aboutPageTemplate});

			//Projects on project page
			var projectCollection = new SubPageCollection();
				
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
				//waiting for westhost to respond
				// projectCollection.add({
				// 	className: 'page-westhost-php-contest',
				// 	html: westhostPHPContest
				// });
				
			
			pages.add({name:'projects',template: projectPageTemplate, subPages: projectCollection});//change projects to subPages
			

			var options = {};

			options.pages = pages;
			

		// Pass in our Router module and call it's initialize function
		Router.initialize(options);
	};

	
	return {
		initialize: initialize
	};
});

