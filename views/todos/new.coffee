h2 -> @title
form method: 'post', action: '/todos', ->
  input type:'text', name:'title'
  input type:'submit', -> 'Create'