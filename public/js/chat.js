const chat = () => {
  let socket = new WebSocket('ws://localhost:4900/')

  const chatForm = document.forms.publish

  chatForm.onsubmit = () => {
    const outgoingMessage = chatForm.message.value

    if (!outgoingMessage) {
      return false
    }

    const data = { type: 'broadcast', data: outgoingMessage }
    socket.send(JSON.stringify(data))

    const messageElem = document.createElement('div')
    messageElem.classList.add('myMessage')
    messageElem.textContent = outgoingMessage
    document.getElementById('messages').append(messageElem)

    chatForm.reset()
    return false
  }

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)

    switch (message.type) {
      case 'message':
        const messageElem = document.createElement('div')
        messageElem.classList.add('message')
        messageElem.textContent = message.data
        document.getElementById('messages').append(messageElem)
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
        ulElement.innerHTML = ''
        ulElement.appendChild(fragment)
        break
      default:
        throw new Error('unknown message type')
    }
  }
}

window.addEventListener('load', () => chat())
