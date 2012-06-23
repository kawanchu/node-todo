h2 -> @title
for item in ['Todos', 'Chats', 'Backbone']
  li -> a href: "/#{item.toLowerCase()}", -> item  