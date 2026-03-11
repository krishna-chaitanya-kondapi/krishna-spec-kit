import path from 'path'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATA_DIR: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((issue) => issue.message).join('; ')
  throw new Error(`Invalid environment configuration: ${issues}`)
}

const dataDir = parsed.data.DATA_DIR
  ? path.resolve(parsed.data.DATA_DIR)
  : path.resolve(process.cwd(), '..', 'data')

export const env = {
  ...parsed.data,
  DATA_DIR: dataDir,
}
