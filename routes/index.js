var fs = require('fs');
/*
 * GET home page.
 */

var built = '';
if (process.env.PORT) {
	built = '-built';
}


exports.index = function(req, res){


	fs.readFile(__dirname + '/../public/javascripts/templates/home.html', 'utf8', function(err, contentWrapper){
		fs.readFile( __dirname + '/../public/javascripts/templates/home/red-dot/me.html', 'utf8', function(err, me){
			var html = contentWrapper.replace('<%= redDot %>', me);
			res.render('index', { 
				title: 'James Charlesworth - Web Developer, Atlanta',
				built: built, 
				content: html,
				meta_desc: 'I make web applications with JavaScript.'
			});
		});
	});

	
};

exports.about = function(req, res){

	fs.readFile(__dirname + '/../public/javascripts/templates/about.html', 'utf8', function(err, contentWrapper){
		
			
			res.render('index', {
				title: 'James Charlesworth - JavaScript, PHP, SEO, Design - Atlanta',
				built: built, 
				content: contentWrapper,
				meta_desc: 'About me - I make Web Applications'
			});
		
	});
};

exports.projects = function(req, res){
	fs.readFile(__dirname + '/../public/javascripts/templates/projects/all.html', 'utf8', function(err, contentWrapper){
		res.render('index', { title: 'James Charlesworth - Web Developer, Atlanta',meta_desc:'',built: built,content: contentWrapper });	
	});
};

exports.project = function(req, res){
	var path = '',
		title = '',
		meta_desc = '';
		
	switch(req.params.subpage) {
		case 'tinymce-thumbnail-gallery':
			path = __dirname + '/../public/javascripts/templates/projects/tinymce-thumbnail-gallery.html';
			title = 'TinyMCE Thumbnail Gallery - JavaScript WordPress Plugin';
			meta_desc = 'A simple image gallery plugin for WordPress.';
			break;
		case 'westchester-square':
			path = __dirname + '/../public/javascripts/templates/projects/westchester-square.html';
			title = 'Westchester Square - Condo Website Portal';
			meta_desc = 'A web application developed for a condo in Ansley Park.  Runs on PHP with Symfony.'
			break;
		case 'mobilebox':
			path = __dirname + '/../public/javascripts/templates/projects/mobile-box.html';
			title = 'Mobile jQuery Lightbox Plugin';
			meta_desc = 'Simple way to show images for mobile browsers';
			break;
		case 'intrade':
			path = __dirname + '/../public/javascripts/templates/projects/intrade.html';
			title = 'Intrade - Node.js Module';
			meta_desc = 'I love building node apps!';
			break;
		default: //@todo, update with 404
			path = __dirname + '/../public/javascripts/templates/projects/tinymce-thumbnail-gallery.html';
			title = 'TinyMCE Thumbnail Gallery - JavaScript WordPress Plugin';
			meta_desc = 'A simple image gallery plugin for WordPress.';			
			break;		
	}

	fs.readFile( path, 'utf8', function(err, contentWrapper){
		res.render('index', {
			title: title,
			built: built,
			content: contentWrapper,
			meta_desc: meta_desc
		});	
	});
};

exports.fourofour = function(req, res) {
	res.status(404);
	res.render('404', {
			title: 'Page not found',
			built: built,
			meta_desc: 'Page not found',
			content: '',
			not_found: true
		});	
}