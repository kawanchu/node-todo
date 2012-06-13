var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes');
  
mongoose.connect('mongodb://localhost/node-todo');
var app = module.exports = express.createServer();

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

var Schema = mongoose.Schema;
var Todo = new Schema(
  {
    title: String
  }
);

var TodoModel = mongoose.model('Todo', Todo);

app.get('/', function(req, res){
  TodoModel.find(function (error, todos) {
    if (!error) {
      res.render('todos/index.jade', { locals:
        {
          title: 'Todo#Index',
          todos: todos
        }
      });
    } else {
      //TODO Error Handling
      console.log(error);
    }
  });
});
 
app.get('/todos/new', function(req, res) {
  res.render('todos/new.jade',{ locals:
    {
      title: 'Todo#New'
    }
  });
});

app.post('/todos', function(req, res){
  var todo = new TodoModel(
    {
      title: req.param('title')
    }
  );
  todo.save(function(error){
    if (!error) {
      res.redirect('/')
    } else {
      //TODO Error Handling
      console.log(error);
    }
  });
});

app.get('/todos/:id', function(req, res) {
  TodoModel.findById(req.params.id, function (error, todo) {
    if (!error) {
      res.render('todos/show.jade', { locals:
        {
          title: 'Todo#Show',
          todo: todo
        }
      });
    } else {
      // TODO Error Handling
      console.log(error);
    }
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
