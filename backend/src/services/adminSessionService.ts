import { randomUUID } from 'crypto'

type SessionRecord = {
  userId: string
  createdAt: number
}

const sessions = new Map<string, SessionRecord>()

export const createAdminSession = (userId: string) => {
  const token = randomUUID()
  sessions.set(token, { userId, createdAt: Date.now() })
  return token
}

export const getAdminSessionUser = (token: string) => {
  const session = sessions.get(token)
  return session?.userId ?? null
}

export const clearAdminSession = (token: string) => {
  sessions.delete(token)
}
