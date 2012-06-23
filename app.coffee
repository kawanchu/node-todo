express = require("express")
mongoose = require("mongoose")
routes = require("./routes")
socketIO = require("socket.io")
port = process.env.PORT or 3000
uri = process.env.MONGOHQ_URL or "mongodb://localhost/mongo_data"
mongoose.connect uri
app = module.exports = express.createServer()

app.configure ->
  app.set "views", __dirname + "/views"
  app.register '.coffee', require('coffeekup').adapters.express
  app.set "view engine", "coffee"
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use express.static(__dirname + "/public")

app.configure "development", ->
  app.use express.errorHandler(
    dumpExceptions: true
    showStack: true
  )

app.configure "production", ->
  app.use express.errorHandler()

Schema = mongoose.Schema
TodoSchema = new Schema(title: String)
ChatSchema = new Schema(message: String)
Todo = mongoose.model("Todo", TodoSchema)
Chat = mongoose.model("Chat", ChatSchema)

app.get "/", (req, res) ->
  res.render "index.coffee",
    locals:
      title: "Menu"

app.get "/todos", (req, res) ->
  Todo.find (error, todos) ->
    unless error
      res.render "todos/index.coffee",
        locals:
          title: "Todo#Index"
          todos: todos
    else
      console.log error

app.get "/todos/new", (req, res) ->
  res.render "todos/new.coffee",
    locals:
      title: "Todo#New"

app.post "/todos", (req, res) ->
  todo = new Todo(req.body)
  todo.save (error) ->
    unless error
      res.redirect "/todos"
    else
      console.log error

app.get "/todos/:id", (req, res) ->
  Todo.findById req.params.id, (error, todo) ->
    unless error
      res.render "todos/show.coffee",
        locals:
          title: "Todo#Show"
          todo: todo
    else
      console.log error

app.get "/todos/:id/edit", (req, res) ->
  Todo.findById req.params.id, (error, todo) ->
    unless error
      res.render "todos/edit.coffee",
        locals:
          title: "Todo#Edit"
          todo: todo
    else
      console.log error

app.post "/todos/:id", (req, res) ->
  Todo.update
    _id: req.params.id
  , req.body, (error) ->
    unless error
      res.redirect "/todos/" + req.params.id
    else
      console.log error

app.get "/todos/:id/delete", (req, res) ->
  Todo.findById req.params.id, (error, todo) ->
    unless error
      todo.remove (delete_error) ->
        unless delete_error
          res.redirect "/todos"
        else
          console.log delete_error
    else
      console.log error

app.get "/chats", (req, res) ->
  Chat.find (error, chats) ->
    unless error
      res.render "chats/index.coffee",
        locals:
          title: "Chat#Index"
          chats: chats
    else
      console.log error

app.get "/backbone", (req, res) ->
  res.render "backbone/index.coffee",
    locals:
      title: "Backbone#Index"

app.listen port, ->
  console.log "Express server listening on port %d in %s mode", app.address().port, app.settings.env

socket = socketIO.listen(app)
socket.configure ->
  socket.set "transports", [ "xhr-polling" ]
  socket.set "polling duration", 10

socket.on "connection", (client) ->
  client.on "send-message", (message) ->
    chat = new Chat(message: message)
    chat.save (error) ->
      unless error
        client.emit "receive-message", chat
        client.broadcast.emit "receive-message", chat
      else

  client.on "delete-message", (chatId) ->
    Chat.findById chatId, (error, chat) ->
      unless error
        chat.remove (delete_error) ->
          unless delete_error
            client.emit "delete-message", chatId
            client.broadcast.emit "delete-message", chatId
          else
            console.log delete_error
      else
        console.log error