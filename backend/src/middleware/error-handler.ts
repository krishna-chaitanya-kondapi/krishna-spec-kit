import type { ErrorRequestHandler, RequestHandler } from 'express'

type ErrorDetails = { field?: string; issue?: string }

export class HttpError extends Error {
  statusCode: number
  code: string
  details?: ErrorDetails[]

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: ErrorDetails[],
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found.',
    },
  })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500
  const code = err instanceof HttpError ? err.code : 'INTERNAL_SERVER_ERROR'
  const message =
    err instanceof HttpError
      ? err.message
      : 'Unexpected error. Please try again later.'

  res.status(statusCode).json({
    error: {
      code,
      message,
      details: err instanceof HttpError ? err.details : undefined,
    },
  })
}
