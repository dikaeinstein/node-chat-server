import pino, { LoggerOptions, Logger } from 'pino'

interface LoggerConfig {
  LOG_LEVEL: string
  LOG_NAME: string
  NODE_ENV: string
}

/**
 * Creates the global logger instance
 */
const createLogger = (config: LoggerConfig): Logger => {
  const pinoOptions: LoggerOptions = {
    name: config.LOG_NAME,
    level: config.LOG_LEVEL,
  }

  if (config.NODE_ENV === 'development') {
    pinoOptions.prettyPrint = {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss.l',
      ignore: 'pid,hostname',
    }
  }

  return pino(pinoOptions)
}

export default createLogger
