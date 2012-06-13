var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

TodoProvider = function(host, port) {
  this.db= new Db('node-mongo-todo', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


TodoProvider.prototype.getCollection= function(callback) {
  this.db.collection('todos', function(error, todo_collection) {
    if( error ) callback(error);
    else callback(null, todo_collection);
  });
};

TodoProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, todo_collection) {
      if( error ) callback(error)
      else {
        todo_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


TodoProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, todo_collection) {
      if( error ) callback(error)
      else {
        todo_collection.findOne({_id: todo_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

TodoProvider.prototype.save = function(todos, callback) {
    this.getCollection(function(error, todo_collection) {
      if( error ) callback(error)
      else {
        if( typeof(todos.length)=="undefined")
          todos = [todos];

        for( var i =0;i< todos.length;i++ ) {
          todo = todos[i];
          todo.created_at = new Date();
        }

        todo_collection.insert(todos, function() {
          callback(null, todos);
        });
      }
    });
};

exports.TodoProvider = TodoProvider;