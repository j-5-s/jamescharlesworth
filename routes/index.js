
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.about = function(req, res){
	res.redirect('/#about');
};

exports.projects = function(req, res){
	var page =  (req.params.length > 0) ? req.params[0] : '';
	res.redirect('/#projects'+page);
};