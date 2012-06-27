# TODO npmを使用するように変更したい
# script src:'/javascripts/json2.js'
script src:'http://code.jquery.com/jquery-1.7.2.min.js'
script src:'http://underscorejs.org/underscore-min.js'
script src:'http://backbonejs.org/backbone-min.js'

coffeescript ->
  $ ->
    Todo = Backbone.Model.extend(
      defaults: ->
        title: ""
        done: false
        initialize: ->
      )
    
    TodoList = Backbone.Collection.extend(
      model: Todo
      url: "/todos"
    )
    
    Todos = new TodoList
    
    TodoView = Backbone.View.extend(
      tagName: "li" 
      template: _.template($('#item-template').html())
           
      initialize: ->

      render: ->
        @$el.html @template(@model.toJSON())
      )
    
    AppView = Backbone.View.extend(
      el: $("#backbone-todo")
      
      events:
        "keypress #new-todo": "addTodo"
        
      initialize: ->
        @input = @$("#new-todo")
        Todos.bind "add", @addOne, this
        Todos.bind "reset", @addAll, this
        Todos.bind "all", @render, this
        @main = $('#main')
        Todos.fetch()
      
      render: ->
        @main.show()
        
      addOne: (todo) ->
        view = new TodoView(model: todo)
        @$("#todo-list").append view.render()
      
      addTodo: (e) ->
        return  unless e.keyCode is 13
        Todos.create title: @input.val()
        @input.val ""
      
      addAll: ->
        Todos.each(@addOne)
    )
    
    App = new AppView

div "#backbone-todo", ->
  header ->
    h2 -> "Bacbone#Index"
    input type:'text', id:'new-todo'
    
  section "#main", ->
    ul "#todo-list", ->

# TODO CoffeeKupのTemplateをうまく使えるようにしたい      
script type: "text/template", id: "item-template", '''
  <div>
    <%= title %>
  </div> 
'''  