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
			res.render('index', { title: 'James Charlesworth - Web Developer, Atlanta',built: built, content: html });
		});
	});

	
};

exports.about = function(req, res){

	fs.readFile(__dirname + '/../public/javascripts/templates/about.html', 'utf8', function(err, contentWrapper){
		
			
			res.render('index', { title: 'James Charlesworth - Web Developer, Atlanta',built: built, content: contentWrapper });
		
	});
};

exports.projects = function(req, res){
	fs.readFile(__dirname + '/../public/javascripts/templates/projects/all.html', 'utf8', function(err, contentWrapper){
		res.render('index', { title: 'James Charlesworth - Web Developer, Atlanta',built: built,content: contentWrapper });	
	});
};

exports.project = function(req, res){
	var path = '';
	switch(req.params.subpage) {
		case 'tinymce-thumbnail-gallery':
			path = __dirname + '/../public/javascripts/templates/projects/tinymce-thumbnail-gallery.html';
			break;
		case 'westchester-square':
			path = __dirname + '/../public/javascripts/templates/projects/westchester-square.html';
			break;
		case 'mobile-box':
			path = __dirname + '/../public/javascripts/templates/projects/mobile-box.html';
			break;
		case 'intrade':
			path = __dirname + '/../public/javascripts/templates/projects/intrade.html';
			break;
		default: //@todo, update with 404
			path = __dirname + '/../public/javascripts/templates/projects/tinymce-thumbnail-gallery.html';
			break;		
	}

	fs.readFile( path, 'utf8', function(err, contentWrapper){
		res.render('index', { title: 'James Charlesworth - Web Developer, Atlanta',built: built,content: contentWrapper });	
	});
};