import type http from 'http'
import type net from 'net'

import type { Logger } from 'pino'
import type { Request, RequestHandler, Response } from 'express'
import WebSocket from 'ws'

import type { KeyOfLang } from '@/enums/locale'
import type TranslationService from '../translation'

export interface User {
  id: string
  username: string
  locale: KeyOfLang
}

export interface TranslateParams {
  source: string
  targetLang: KeyOfLang
  sourceLang?: KeyOfLang
}

export interface Store {
  saveUser: (user: User) => void
  getUser: (userId: string) => User | undefined
  getUsers: () => User[]
}

export interface ITranslationService {
  translate: (params: TranslateParams) => string | Promise<string>
}

interface Message {
  type: 'broadcast' | 'message' | 'userList'
}
interface MessageOf<T> extends Message {
  data: T
}

interface ProcessClientMessageParams {
  message: unknown
  userId: string
  ws: WebSocket
}

type MessageBuilder<T> = (user: User, ws?: WebSocket) => T | Promise<T>

export interface ChatServiceOptions {
  logger: Logger
  server: http.Server
  sessionParser: RequestHandler
  store: Store
  translationService: TranslationService
  wss: WebSocket.Server
  wsStore: Map<string, WebSocket>
}

type Listener = (data: WebSocket.Data) => void

class ChatService {
  private readonly logger: Logger
  private readonly wss: WebSocket.Server
  private readonly store: Store
  private readonly server: http.Server
  private readonly sessionParser: RequestHandler
  private readonly translationService: ITranslationService
  private readonly wsStore: Map<string, WebSocket>

  constructor({
    logger,
    server,
    sessionParser,
    store,
    translationService,
    wss,
    wsStore,
  }: ChatServiceOptions) {
    this.logger = logger
    this.server = server
    this.sessionParser = sessionParser
    this.store = store
    this.translationService = translationService
    this.wss = wss
    this.wsStore = wsStore
  }

  private readonly handleUpgrade = (
    request: Request,
    socket: net.Socket,
    head: Buffer,
  ): void => {
    this.logger.info('Parsing session from request...')

    const response = {} as unknown as Response
    this.sessionParser(request, response, () => {
      if (request.session.userId === '' || request.session.userId == null) {
        socket.write('HTTP/1.1 302 Found\r\n\r\nLOCATION: /')
        socket.destroy()
        return
      }

      this.logger.info('Session is parsed!')

      this.wss.handleUpgrade(request, socket, head, (ws) => {
        this.wss.emit('connection', ws, request)
      })
    })
  }

  broadcastMessage = async <T>(
    id: string,
    ws: WebSocket,
    msgBuilder: MessageBuilder<T>,
  ): Promise<void> => {
    for (const [userId, client] of this.wsStore.entries()) {
      if (
        userId !== id &&
        client !== ws &&
        client.readyState === WebSocket.OPEN
      ) {
        const user = this.store.getUser(userId)

        if (user != null) {
          const result = msgBuilder(user, ws)
          const data = result instanceof Promise ? await result : result
          client.send(JSON.stringify(data), (err) => {
            if (err != null) throw err
          })
        }
      }
    }
  }

  private async processClientMessage({
    message,
    userId,
    ws,
  }: ProcessClientMessageParams): Promise<void> {
    const { type } = message as Message
    switch (type) {
      case 'broadcast': {
        const { data } = message as MessageOf<string>
        await this.broadcastMessage(userId, ws, async (user) => {
          const translatedText = await this.translationService.translate({
            source: data,
            targetLang: user.locale,
          })

          return { type: 'message', data: translatedText }
        })
        break
      }
      case 'message':
        /* should be used for personal/private messages */
        break
      default:
        throw new Error('unknown clientMessage type')
    }
  }

  handleMessage(userId: string, ws: WebSocket) {
    return async (message: WebSocket.Data) => {
      try {
        const clientMessage = JSON.parse(message as string)
        await this.processClientMessage({ message: clientMessage, userId, ws })
      } catch (error) {
        this.logger.error(error)
      }
    }
  }

  start(): void {
    this.server.on('upgrade', this.handleUpgrade)

    this.wss.on('connection', (ws, request) => {
      const userId = (request as Request).session.userId
      this.wsStore.set(userId, ws)

      // Notify clients when a new user/client joins
      void this.broadcastMessage<MessageOf<User[]>>(userId, ws, (user) => {
        const users = this.store.getUsers().filter((u) => u.id !== user.id)
        return { type: 'userList', data: users }
      })

      ws.on('message', this.handleMessage(userId, ws) as unknown as Listener)
    })
  }
}

export default ChatService
