import assert from 'assert'

interface Config {
  API_PREFIX: string
  DEEPL_AUTH_KEY: string
  DEEPL_HOST: string
  HOSTNAME: string | undefined
  LOG_LEVEL: string
  LOG_NAME: string
  NODE_ENV: string
  SERVER_PORT: number
  SESSION_SECRET: string
}

const createConfig = (): Config => {
  assert(process.env.SESSION_SECRET, 'SESSION_SECRET is required')
  assert(process.env.DEEPL_AUTH_KEY, 'DEEPL_AUTH_KEY must be specified')

  return {
    API_PREFIX: process.env.API_PREFIX ?? '/api',
    HOSTNAME: process.env.HOSTNAME,
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
    LOG_NAME: process.env.LOG_NAME ?? 'node-chat-server',
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    SERVER_PORT: parseInt(process.env.PORT ?? '4999'),
    DEEPL_HOST: process.env.DEEPL_HOST ?? 'api-free.deepl.com',
    DEEPL_AUTH_KEY: process.env.DEEPL_AUTH_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET,
  }
}

export default createConfig
