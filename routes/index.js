var fs = require('fs');
/*
 * GET home page.
 */

var built = '';
if (process.env.PORT) {
	built = '-built';
}


exports.index = function(req, res){
	
	res.render('index', {
		title: 'James Charlesworth - Web Developer, Atlanta, SEO',
		built: built,
		content: '',
		meta_desc: 'I make web applications with JavaScript.'
	});
};

exports.about = function(req, res){
	res.redirect('/#about');
	// res.render('index', {
	// 	title: 'James Charlesworth - JavaScript, PHP, SEO, Design - Atlanta',
	// 	built: built,
	// 	content: about,
	// 	meta_desc: 'About me - I make Web Applications'
	// });
};

exports.projects = function(req, res){
	res.redirect('/#projects');
	// res.render('index', {
	// 	title: 'James Charlesworth - Web Developer, Atlanta',
	// 	meta_desc:'',
	// 	built: built,
	// 	content: all
	// });	
};

exports.project = function(req, res){
	var path = '',
		title = '',
		meta_desc = '',
		content = '';	

	if (!req.params.subpage) {
		return res.redirect('/');
	} else {
		return res.redirect('/#projects/'+req.params.subpage);
	}
	
	// switch(req.params.subpage) {
	// 	case 'tinymce-thumbnail-gallery':
	// 		content = gallery['tinymce-thumbnail-gallery'];
	// 		title = 'TinyMCE Thumbnail Gallery - JavaScript WordPress Plugin';
	// 		meta_desc = 'A simple image gallery plugin for WordPress.';
	// 		break;
	// 	case 'westchester-square':
	// 		content = gallery['westchester-square'];
	// 		title = 'Westchester Square - Condo Website Portal';
	// 		meta_desc = 'A web application developed for a condo in Ansley Park.  Runs on PHP with Symfony.';
	// 		break;
	// 	case 'mobilebox':
	// 		content = gallery['mobilebox'];
	// 		title = 'Mobile jQuery Lightbox Plugin';
	// 		meta_desc = 'Simple way to show images for mobile browsers';
	// 		break;
	// 	case 'intrade':
	// 		content = gallery['intrade'];
	// 		title = 'Intrade - Node.js Module';
	// 		meta_desc = 'I love building node apps!';
	// 		break;
	// 	case 'westhost-php-contest':
	// 		content = gallery['westhost-php-contest'];
	// 		title = 'WestHost PHP Content - SEO Campaign';
	// 		meta_desc = 'A fantastic, link generating SEO campaign developed on Symfony';
	// 		break;
	// 	default: //@todo, update with 404
	// 		content = gallery['tinymce-thumbnail-gallery'];
	// 		title = 'TinyMCE Thumbnail Gallery - JavaScript WordPress Plugin';
	// 		meta_desc = 'A simple image gallery plugin for WordPress.';
	// 		break;
	// }
		
	// res.render('index', {
	// 	title: title,
	// 	built: built,
	// 	content: content,
	// 	meta_desc: meta_desc
	// });
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
};