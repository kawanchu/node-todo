h2 -> @title
p ->
  a href: '/todos/new', -> 'New Todo'
table ->
  tr ->
    th -> 'Title'
    th
  for todo in @todos
    tr ->
      td -> todo.title
      td ->
        span -> a href: "/todos/#{todo._id}", -> 'Show'
        span -> '&nbsp;'
        span -> a href: "/todos/#{todo._id}/edit", -> 'Edit'
        span -> '&nbsp;'
        span -> a href: "/todos/#{todo._id}/delete", -> 'Destroy'