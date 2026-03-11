import type { RequestHandler } from 'express'
import { HttpError } from './error-handler'
import { getAdminSessionUser } from '../services/adminSessionService'

const SESSION_COOKIE = 'admin_session'

const parseCookies = (header: string | undefined) => {
  if (!header) return {}
  return header.split(';').reduce<Record<string, string>>((acc, part) => {
    const [rawKey, ...rest] = part.trim().split('=')
    if (!rawKey) return acc
    acc[rawKey] = decodeURIComponent(rest.join('='))
    return acc
  }, {})
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const cookies = parseCookies(req.headers.cookie)
  const token = cookies[SESSION_COOKIE]

  if (!token) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Admin authentication required.'))
  }

  const userId = getAdminSessionUser(token)

  if (!userId) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Invalid or expired session.'))
  }

  req.user = { userId }
  return next()
}
