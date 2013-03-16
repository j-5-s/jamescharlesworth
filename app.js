
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});
app.configure('production', function(){
  app.use(express.logger());
});








app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);

});

app.get('*', function(req,res,next){
  if(req.headers.host === '108.227.65.206'){
    res.redirect('http://ecruisenews.net');
  } else {
    app.use(require('node-force-domain').redirect('jamescharlesworth.com'));
    next();
  }
});





app.get('/', routes.index);

app.get('/about', routes.about );
app.get('/projects', routes.projects );
app.get('/projects/:subpage', routes.project );

app.get('*',routes.fourofour);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
