script src:'http://code.jquery.com/jquery-1.7.2.min.js'
script src:'/socket.io/socket.io.js'
coffeescript ->
  $ ->
    socket = io.connect()
    socket.on "connect", ->
      socket.on "receive-message", (chat) ->
        container = $("<div>").attr('id', "chat_#{chat._id}")
        message = $("<span>").html(chat.message)
        deletelink = $("<span>").append($("<a>").attr('id', chat._id).attr('class', 'delete-link').attr('href', '#').html('×'))
        container.append(deletelink).append(message)
        console.log(container)
        
        $("#messages").append(container)

      socket.on "delete-message", (chatId) ->
        $("#chat_#{chatId}").remove()
  
    $("#messageBtn").click ->
      socket.emit "send-message", $("#message").val()
  
    $(".delete-link").live("click", ->
      socket.emit "delete-message", $(this).attr('id')
    )

h2 -> @title

div ->
  input type:'text', id:'message', style:'width:200px;'
  input type:'button', value:'送信', id:'messageBtn'

div '#messages', ->
  for chat in @chats
    div "#chat_#{chat._id}", ->
      span -> a "##{chat._id}.delete-link", href: "#", -> '×'
      span -> chat.message