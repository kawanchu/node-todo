doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title
    link rel: 'stylesheet', href: '/stylesheets/style.css'  
  body ->
    h1 ->
      a '.logo', href: '/', -> 'Node-Todo'
    @body