$ ->
  Todo = Backbone.Model.extend
    idAttribute: "_id"
    defaults: ->
      title: ""
      done: false
    clear: ->
      @destroy()

  TodoList = Backbone.Collection.extend
    model: Todo
    url: "/todos"

  Todos = new TodoList

  TodoView = Backbone.View.extend
    tagName: "li" 
    
    template: CoffeeKup.compile ->
      div '.view', ->
        span @title
        a 'destroy', href: "#"
    
    events:
      "click a.destroy": "clear"
    
    initialize: ->
      @model.bind 'destroy', @remove, this

    clear: ->
      @model.clear()

    render: ->
      @$el.html @template(@model.toJSON())
    
  AppView = Backbone.View.extend
    el: $("#todoapp")

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
  
  App = new AppView