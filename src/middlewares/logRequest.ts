import { Handler } from 'express'
import { Logger } from 'pino'

interface LogRequestParams {
  logger: Logger
  silent?: boolean
  userPath?: string
}

/**
 * Middleware that logs all incoming requests.
 * Param silent toggles log output.
 * Param userPath specifies the field on res.locals to access the
 * current user for the request-response.
 */
export default ({
  logger,
  silent = false,
  userPath = 'currentUser',
}: LogRequestParams): Handler =>
  async function logRequest(req, res, next) {
    // Log by default (unless silent is set to true)
    res.locals.silent = silent

    const startTime = new Date()

    res.once('finish', () => {
      const elapsedTime = Math.max(
        1,
        new Date().getTime() - startTime.getTime(),
      )

      const { id: userId } = res.locals[userPath] ?? {}

      const metadata = {
        userAgent: req.get('user-agent') ?? 'unknown',
        ip: req.ip,
        timestamp: startTime.toISOString(),
        user: userId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        requestLength: req.get('Content-Length'),
        'responseTime(ms)': elapsedTime,
        responseLength: res.get('Content-Length'),
      }

      if (res.locals.silent !== true) {
        const logLine = `${req.method} ${req.originalUrl} ${res.statusCode} - ${elapsedTime} ms`
        logger.info(metadata, logLine)
      }
    })

    next()
  }
