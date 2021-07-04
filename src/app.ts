import path from 'path'

import express, { Express, RequestHandler } from 'express'
import { Logger } from 'pino'
import { v4 as uuidv4 } from 'uuid'
import WebSocket from 'ws'

import logRequest from '@/middlewares/logRequest'
import errorAsJson from '@/middlewares/errorAsJson'
import type { Store } from '@/services/chat'

interface AppConfig {
  API_PREFIX: string
}

interface CreateAppParams {
  config: AppConfig
  logger: Logger
  sessionParser: RequestHandler
  store: Store
  wsStore: Map<string, WebSocket>
}

const createApp = ({
  config,
  logger,
  sessionParser,
  store,
  wsStore,
}: CreateAppParams): Express => {
  const app = express()

  app.use(logRequest({ logger }))
  app.use(express.static('public'))
  app.use(express.urlencoded({ extended: true }))
  app.use(sessionParser)

  app.get('/healthz', (req, res) => res.json({ alive: true }))
  app.get(config.API_PREFIX, (req, res) =>
    res.json({ message: 'Welcome to Node.js chat server' }),
  )

  app.post('/login', (req, res) => {
    const id = uuidv4()
    const { username, locale } = req.body

    logger.info('Updating session for user', id)
    req.session.userId = id
    store.saveUser({ id, locale, username })

    res.redirect('/chat')
  })

  app.get('/chat', (req, res) => {
    if (req.session.userId == null) {
      return res.redirect('/')
    }

    res.sendFile('chat.html', {
      root: path.join(process.cwd(), 'public'),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    })
  })

  app.delete('/logout', (req, res) => {
    if (req.session.userId != null) {
      const ws = wsStore.get(req.session.userId)

      if (ws != null) {
        logger.info('Destroying session')
        req.session.destroy(() => {
          ws.close()
          res.send({ result: 'OK', message: 'Session destroyed' })
        })
      }
    }
  })

  app.use((req, res) => res.json({ message: 'Woops... Not found!' }))
  app.use(errorAsJson)

  return app
}

export default createApp
