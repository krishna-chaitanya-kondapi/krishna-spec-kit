import { z } from 'zod'

export const adminAuthSchema = z.object({
  userId: z.string().min(3).max(64),
  password: z.string().min(8).max(256),
})
