h2 -> @title
table ->
  tr ->
    th -> 'Title'
  tr ->
    td -> @todo.title
p ->
  span -> a href: "/todos", -> 'Index'
  span -> '&nbsp;'
  span -> a href: "/todos/#{todo._id}/edit", -> 'Edit'