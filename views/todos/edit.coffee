h2 -> @title
form method: 'post', action: "/todos/#{@todo._id}", ->
  input type:'text', name:'title', value: "#{@todo.title}"
  input type:'submit', -> 'Update'
p ->
  span -> a href: "/todos", -> 'Index'