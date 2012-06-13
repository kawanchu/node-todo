
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');
  
var ArticleProvider = require('./todoprovider-mongodb').TodoProvider;


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

var todoProvider= new TodoProvider('localhost', 27017);

app.get('/', function(req, res){
  todoProvider.findAll(function(error,todos){
    res.render('todos/index.jade',
      { locals:
        {
          title: 'Todo#Index',
          todos: todos
        }
      }
    );
  })
});

app.get('/todos/new', function(req, res) {
  res.render('todos/new.jade',
    { locals:
      {
        title: 'Todo#New'
      }
    }
  );
});

app.post('/todos/new', function(req, res){
  todoProvider.save(
    {
      title: req.param('title'),
    }, function(error, docs) {
      res.redirect('/')
    }
  );
});

app.get('/todos/:id', function(req, res) {
  todoProvider.findById(req.params.id, function(error, todo) {
    res.render('todos/show.jade',
      { locals:
        {
          title: 'Todo#Show',
          todo: todo
        }
      }
    );
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
