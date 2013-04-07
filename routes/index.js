var fs = require('fs');
/*
 * GET home page.
 */


var getBuilt = function() {
	var built = '';
	if (process.env.PORT) {
		built = '-built';
	}
	return built;
}
var built = getBuilt();

var home       = fs.readFileSync(__dirname + '/../public/javascripts/templates/home.html', 'utf8'),
	all      = fs.readFileSync(__dirname + '/../public/javascripts/templates/projects/all.html', 'utf8'),
	about = fs.readFileSync(__dirname + '/../public/javascripts/templates/about.html', 'utf8');

var gallery = {
	'tinymce-thumbnail-gallery': fs.readFileSync(__dirname + '/../public/javascripts/templates/projects/tinymce-thumbnail-gallery.html','utf8'),
	'westchester-square': fs.readFileSync(__dirname + '/../public/javascripts/templates/projects/westchester-square.html','utf8'),
	'mobilebox': fs.readFileSync(__dirname + '/../public/javascripts/templates/projects/mobile-box.html','utf8'),
	'intrade': fs.readFileSync(__dirname + '/../public/javascripts/templates/projects/intrade.html','utf8'),
	'westhost-php-contest': fs.readFileSync(__dirname + '/../public/javascripts/templates/projects/westhost-php-contest.html','utf8'),
};



exports.index = function(req, res){

	res.render('index', {
		title: 'James Charlesworth - JavaScript Developer Atlanta',
		built: getBuilt(),
		content: home,
		meta_desc: 'I make web applications with JavaScript.'
	});
};

exports.about = function(req, res){

	res.render('index', {
		title: 'James Charlesworth - JavaScript, PHP, SEO, Design - Atlanta',
		built: built,
		content: about,
		meta_desc: 'About me - I make Web Applications'
	});
};

exports.projects = function(req, res){

	res.render('index', {
		title: 'James Charlesworth - Web Developer, Atlanta',
		meta_desc:'',
		built: built,
		content: all
	});
};

exports.project = function(req, res){
	var path = '',
		title = '',
		meta_desc = '',
		content = '';

	if (!req.params.subpage) {
		return res.redirect('/');
	}

	switch(req.params.subpage) {
		case 'tinymce-thumbnail-gallery':
			content = gallery['tinymce-thumbnail-gallery'];
			title = 'TinyMCE Thumbnail Gallery - JavaScript WordPress Plugin';
			meta_desc = 'A simple image gallery plugin for WordPress.';
			break;
		case 'westchester-square':
			content = gallery['westchester-square'];
			title = 'Westchester Square - Condo Website Portal';
			meta_desc = 'A web application developed for a condo in Ansley Park.  Runs on PHP with Symfony.';
			break;
		case 'mobilebox':
			content = gallery['mobilebox'];
			title = 'Mobile jQuery Lightbox Plugin';
			meta_desc = 'Simple way to show images for mobile browsers';
			break;
		case 'intrade':
			content = gallery['intrade'];
			title = 'Intrade - Node.js Module';
			meta_desc = 'I love building node apps!';
			break;
		case 'westhost-php-contest':
			content = gallery['westhost-php-contest'];
			title = 'WestHost PHP Content - SEO Campaign';
			meta_desc = 'A fantastic, link generating SEO campaign developed on Symfony';
			break;
		default: //@todo, update with 404
			content = gallery['tinymce-thumbnail-gallery'];
			title = 'TinyMCE Thumbnail Gallery - JavaScript WordPress Plugin';
			meta_desc = 'A simple image gallery plugin for WordPress.';
			break;
	}

	res.render('index', {
		title: title,
		built: built,
		content: content,
		meta_desc: meta_desc
	});
};

exports.fourofour = function(req, res) {
	res.status(404);
	res.render('404', {
		title: 'Page not found',
		built: getBuilt(),
		meta_desc: 'Page not found',
		content: '',
		not_found: true
	});
};