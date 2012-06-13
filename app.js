
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
  
var ArticleProvider = require('./todoprovider-memory').TodoProvider;


var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var todoProvider= new TodoProvider();

app.get('/', function(req, res){
  todoProvider.findAll(function(error,todos){
    res.render('index.jade',
      { locals:
        {
          title: 'Todo',
          todos: todos
        }
      }
    );
  })
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
