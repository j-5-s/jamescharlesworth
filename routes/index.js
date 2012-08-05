
/*
 * GET home page.
 */

exports.index = function(req, res){
	var built = '';
	if (process.env.PORT) {
		built = '-built';
	}

	res.render('index', { title: 'James Charlesworth - Web Developer, Atlanta',built: built });
};

exports.about = function(req, res){
	res.redirect('/#about');
};

exports.projects = function(req, res){
	var page =  (req.params.length > 0) ? req.params[0] : '';
	res.redirect('/#projects'+page);
};