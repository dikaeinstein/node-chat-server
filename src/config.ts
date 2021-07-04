interface Config {
  API_PREFIX: string
  DEEPL_AUTH_KEY: string
  DEEPL_HOST: string
  HOSTNAME: string | undefined
  LOG_LEVEL: string
  LOG_NAME: string
  NODE_ENV: string
  SERVER_PORT: number
}

const createConfig = (): Config => ({
  API_PREFIX: process.env.API_PREFIX ?? '/api',
  HOSTNAME: process.env.HOSTNAME,
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
  LOG_NAME: process.env.LOG_NAME ?? 'node-chat-server',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  SERVER_PORT: parseInt(process.env.PORT ?? '4999'),
  DEEPL_HOST: process.env.DEEPL_HOST ?? 'api-free.deepl.com',
  DEEPL_AUTH_KEY: process.env.DEEPL_AUTH_KEY ?? '',
})

export default createConfig
