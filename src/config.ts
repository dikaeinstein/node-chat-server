export interface Config {
  HOSTNAME: string | undefined
  LOG_LEVEL: string
  LOG_NAME: string
  NODE_ENV: string
  SERVER_PORT: number
}

const createConfig = (): Config => ({
  HOSTNAME: process.env.HOSTNAME,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  LOG_NAME: process.env.LOG_NAME ?? 'node-chat-server',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  SERVER_PORT: parseInt(process.env.PORT ?? '4999'),
})

export default createConfig
