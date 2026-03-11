export type AdminUser = {
  id: string
  userId: string
  passwordHash: string
  createdAt: string
  lastLoginAt?: string | null
}
