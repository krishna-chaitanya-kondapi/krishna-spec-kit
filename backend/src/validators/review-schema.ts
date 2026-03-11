import { z } from 'zod'

export const reviewSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  note: z.string().max(2000).optional(),
})
