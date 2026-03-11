import { Router } from 'express'
import { adminAuthSchema } from '../validators/admin-auth-schema'
import { authenticateAdmin, registerAdmin } from '../services/adminAuthService'
import {
  clearAdminSession,
  createAdminSession,
} from '../services/adminSessionService'
import { HttpError } from '../middleware/error-handler'

const SESSION_COOKIE = 'admin_session'

export const adminRouter = Router()

adminRouter.post('/admin/setup', async (req, res, next) => {
  const parsed = adminAuthSchema.safeParse(req.body)

  if (!parsed.success) {
    return next(new HttpError(400, 'VALIDATION_ERROR', 'Invalid credentials.'))
  }

  try {
    await registerAdmin(parsed.data.userId, parsed.data.password)
    res.status(201).json({ message: 'Admin created' })
  } catch (error) {
    next(error)
  }
})

adminRouter.post('/admin/login', async (req, res, next) => {
  const parsed = adminAuthSchema.safeParse(req.body)

  if (!parsed.success) {
    return next(new HttpError(400, 'VALIDATION_ERROR', 'Invalid credentials.'))
  }

  try {
    const admin = await authenticateAdmin(parsed.data.userId, parsed.data.password)
    const sessionToken = createAdminSession(admin.userId)

    res.cookie(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8,
    })

    res.status(200).json({ message: 'Logged in' })
  } catch (error) {
    next(error)
  }
})

adminRouter.post('/admin/logout', (req, res) => {
  const cookieHeader = req.headers.cookie
  const token = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.split('=')[1]

  if (token) {
    clearAdminSession(token)
  }

  res.clearCookie(SESSION_COOKIE)
  res.status(204).send()
})
