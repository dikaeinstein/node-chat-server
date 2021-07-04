const chat = () => {
  /** Websocket Chat */
  let socket = new WebSocket('ws://localhost:4900/')

  const chatForm = document.forms.publish
  // send message from the form
  chatForm.onsubmit = () => {
    const outgoingMessage = chatForm.message.value

    const data = { type: 'broadcast', data: outgoingMessage }
    socket.send(JSON.stringify(data))
    chatForm.reset()
    return false
  }

  // message received - show the message in div#messages
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)

    switch (message.type) {
      case 'message':
        const messageElem = document.createElement('div')
        messageElem.textContent = message.data
        document.getElementById('messages').prepend(messageElem)
        break
      case 'userList':
        const users = message.data
        const fragment = document.createDocumentFragment()
        users.forEach((u) => {
          const liElement = document.createElement('li')
          liElement.value = u.username
          liElement.innerHTML = `${u.username} - ${u.locale}`
          fragment.appendChild(liElement)
        })
        const ulElement = document.getElementById('users')
        ulElement.appendChild(fragment)
        break
      default:
        break
    }
  }
}

window.addEventListener('load', () => chat())
