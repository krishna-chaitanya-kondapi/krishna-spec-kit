import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { HttpError } from '../middleware/error-handler'
import {
  adminExists,
  createAdminUser,
  findAdminByUserId,
} from '../storage/adminUserStore'

const scrypt = promisify(scryptCallback)

const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return `scrypt$${salt}$${derivedKey.toString('hex')}`
}

const verifyPassword = async (password: string, storedHash: string) => {
  const [scheme, salt, key] = storedHash.split('$')
  if (scheme !== 'scrypt' || !salt || !key) {
    return false
  }
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return timingSafeEqual(Buffer.from(key, 'hex'), derivedKey)
}

export const registerAdmin = async (userId: string, password: string) => {
  if (await adminExists()) {
    throw new HttpError(409, 'ADMIN_EXISTS', 'Admin already exists.')
  }

  const passwordHash = await hashPassword(password)
  return createAdminUser(userId, passwordHash)
}

export const authenticateAdmin = async (userId: string, password: string) => {
  const user = await findAdminByUserId(userId)
  if (!user) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Invalid credentials.')
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Invalid credentials.')
  }

  return user
}
