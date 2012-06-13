var todoCounter = 1;

TodoProvider = function(){};
TodoProvider.prototype.dummyData = [];

TodoProvider.prototype.findAll = function(callback) {
  callback(null, this.dummyData)
};

TodoProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

TodoProvider.prototype.save = function(todos, callback) {
  var todo = null;

  if(typeof(todos.length)=="undefined")
    todos = [todos];

  for(var i =0; i< todos.length; i++) {
    todo = todos[i];
    todo._id = todoCounter++;
    todo.created_at = new Date();

    if(todo.comments === undefined)
      todo.comments = [];

    for(var j =0; j< todo.comments.length; j++) {
      todo.comments[j].created_at = new Date();
    }
    this.dummyData[this.dummyData.length]= todo;
  }
  callback(null, todos);
};

new TodoProvider().save([
  {title: 'Todo one'},
  {title: 'Todo two'},
  {title: 'Todo three'}
], function(error, todos){});

exports.TodoProvider = TodoProvider;