import { ErrorRequestHandler } from 'express'

import HTTPStatusCode from '@/enums/httpStatusCode'
import justMyCode from '@/utils/justMyCode'

interface ErrorResponse {
  kind: string
  code: string | number
  reason?: string
  message: string
  stack?: string[]
}

/* Middleware that serializes errors as JSON responses */
export default ({ expose = false }): ErrorRequestHandler =>
  async function errorAsJson(err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    const status =
      err.status ?? err.statusCode ?? HTTPStatusCode.InternalServerError
    res.status(status)

    const error: ErrorResponse = {
      kind: err.name ?? err.constructor.name,
      code: err.code ?? err.errorCode,
      reason: err.reason,
      message: err.message ?? null,
    }

    // If set to expose stack traces, append it to the body
    if (expose && typeof err.stack === 'string') {
      error.stack = justMyCode(err.stack)
    }

    // Emit error to global listener
    res.app.emit('error', err)

    res.json({ error })
  }
