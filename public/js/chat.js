const chat = () => {
  /** Websocket Chat */
  let socket = new WebSocket('ws://localhost:4900/')

  const chatForm = document.forms.publish
  // send message from the form
  chatForm.onsubmit = () => {
    const outgoingMessage = chatForm.message.value

    socket.send(outgoingMessage)
    return false
  }

  // message received - show the message in div#messages
  socket.onmessage = function (event) {
    const message = event.data

    const messageElem = document.createElement('div')
    messageElem.textContent = message
    document.getElementById('messages').prepend(messageElem)
  }
}

window.addEventListener('load', () => chat())
