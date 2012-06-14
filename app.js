var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes');

var port = process.env.PORT || 3000;
var uri = process.env.MONGOHQ_URL || 'mongodb://localhost/mongo_data';
mongoose.connect(uri);

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
var TodoSchema = new Schema(
  {
    title: String
  }
);

var Todo= mongoose.model('Todo', TodoSchema);

app.get('/', function(req, res){
  res.render('index.jade', { locals:
    {
      title: 'Menu'
    }
  });
});

app.get('/todos', function(req, res){
  Todo.find(function (error, todos) {
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
  var todo = new Todo(req.body);
  todo.save(function(error){
    if (!error) {
      res.redirect('/todos')
    } else {
      //TODO Error Handling
      console.log(error);
    }
  });
});

app.get('/todos/:id', function(req, res) {
  Todo.findById(req.params.id, function (error, todo) {
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

app.get('/todos/:id/edit', function(req, res) {
  Todo.findById(req.params.id, function (error, todo) {
    if (!error) {
      res.render('todos/edit.jade', { locals:
        {
          title: 'Todo#Edit',
          todo: todo
        }
      });
    } else {
      // TODO Error Handling
      console.log(error);
    }
  });
});

// PUT Method使えない?
app.post('/todos/:id', function(req, res){
  Todo.update({_id: req.params.id }, req.body, function (error) {
    if (!error) {
      res.redirect('/todos/'+req.params.id);
    } else {
      // TODO Error Handling
      console.log(error);
    }
  });
});

// DELETE Method 使えない?
app.get('/todos/:id/delete', function(req, res) {
  Todo.findById(req.params.id, function(error, todo) {
    if(!error){
      todo.remove(function(delete_error) {
        if(!delete_error) {
          res.redirect('/')
        } else {
          //TODO Error Handling
          console.log(delete_error);
        }
      });
    } else {
      //TODO Error Handling
      console.log(error);
    }
  });
});

app.get('/chats', function(req, res){
  res.render('chats/index.jade', { locals:
    {
      title: 'Chat#Index'
    }
  });
});

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
