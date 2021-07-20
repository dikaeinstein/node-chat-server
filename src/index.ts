import http from 'http'
import os from 'os'

import axios from 'axios'
import dotenv from 'dotenv'
import session from 'express-session'
import WebSocket from 'ws'

import ChatService from '@/services/chat'
import createConfig from '@/config'
import createLogger from '@/logger'
import createApp from '@/app'
import DeepL from '@/lib/deepL'
import InMemoryStore from '@/storage/inmem'
import TranslationService from '@/services/translation'

dotenv.config()

const config = createConfig()
const logger = createLogger(config)

const hostname = config.HOSTNAME ?? os.hostname()
const port = config.SERVER_PORT

const sessionParser = session({
  saveUninitialized: false,
  secret: config.SESSION_SECRET,
  resave: false,
})
const wsStore = new Map<string, WebSocket>()
const store = new InMemoryStore()
const app = createApp({ config, logger, sessionParser, store, wsStore })

const server = http.createServer(app)
const wss = new WebSocket.Server({ clientTracking: false, noServer: true })

const deepL = new DeepL(
  config,
  axios.create({
    baseURL: config.DEEPL_HOST,
    timeout: 5000,
  }),
  logger,
)
const translationService = new TranslationService(deepL)
const chatService = new ChatService({
  logger,
  sessionParser,
  server,
  store,
  translationService,
  wss,
  wsStore,
})

chatService.start()

server.listen(port, () => {
  logger.info(
    `API is now listening for incoming requests on ${hostname}:${port}...`,
  )
})
