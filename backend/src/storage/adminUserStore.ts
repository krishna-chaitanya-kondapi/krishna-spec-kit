import path from 'path'
import { randomUUID } from 'crypto'
import { env } from '../config/env'
import { ensureCsvFile, appendCsvRow, readCsv } from './csvStore'
import type { AdminUser } from '../models/adminUser'

const ADMIN_USERS_HEADER = [
  'id',
  'userId',
  'passwordHash',
  'createdAt',
  'lastLoginAt',
]

const getAdminUsersPath = () => path.join(env.DATA_DIR, 'admin_users.csv')

export const ensureAdminUsersFile = async () => {
  await ensureCsvFile(getAdminUsersPath(), ADMIN_USERS_HEADER)
}

export const getAdminUsers = async () => {
  await ensureAdminUsersFile()
  const { rows } = await readCsv(getAdminUsersPath())

  return rows.map<AdminUser>((row) => ({
    id: row.id,
    userId: row.userId,
    passwordHash: row.passwordHash,
    createdAt: row.createdAt,
    lastLoginAt: row.lastLoginAt || null,
  }))
}

export const findAdminByUserId = async (userId: string) => {
  const users = await getAdminUsers()
  return users.find((user) => user.userId === userId) ?? null
}

export const adminExists = async () => {
  const users = await getAdminUsers()
  return users.length > 0
}

export const createAdminUser = async (userId: string, passwordHash: string) => {
  const now = new Date().toISOString()
  const record = [randomUUID(), userId, passwordHash, now, '']

  await ensureAdminUsersFile()
  await appendCsvRow(getAdminUsersPath(), record)

  return {
    id: record[0],
    userId,
    passwordHash,
    createdAt: now,
    lastLoginAt: null,
  } satisfies AdminUser
}
