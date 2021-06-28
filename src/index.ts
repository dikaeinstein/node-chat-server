import os from 'os'

import dotenv from 'dotenv'
import express from 'express'

import createConfig from './config'
import createLogger from './logger'

dotenv.config()

const config = createConfig()
const logger = createLogger(config)

const hostname = config.HOSTNAME ?? os.hostname()
const port = config.SERVER_PORT

const server = express()

server.listen(port, () => {
  logger.info(
    `API is now listening for incoming requests on ${hostname}:${port}...`,
  )
})
