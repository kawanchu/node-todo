# script src:'/javascripts/json2.js'
script src: 'http://underscorejs.org/underscore-min.js'
script src: 'http://code.jquery.com/jquery-1.7.2.min.js'
script src: 'http://backbonejs.org/backbone-min.js'
script src: 'vendor/coffeekup/lib/coffeekup.js'
link rel: 'stylesheet', href: 'stylesheets/todo.css'

# development only !
script src: 'http://jashkenas.github.com/coffee-script/extras/coffee-script.js'
script src: 'javascripts/todo.coffee', type: 'text/coffeescript'

h2 -> "Bacbone#Index"

div "#todoapp", ->
  header ->
    input type:'text', id:'new-todo'
    
  section "#main", ->
    ul "#todo-list", -> 