import type { RequestHandler } from 'express'

const SAMPLE_SIZE = 50
const durations: number[] = []

const percentile = (values: number[], p: number) => {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil(p * sorted.length) - 1
  return sorted[Math.max(index, 0)]
}

export const perfTimingMiddleware: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const end = process.hrtime.bigint()
    const durationMs = Number(end - start) / 1e6

    durations.push(durationMs)

    if (durations.length >= SAMPLE_SIZE) {
      const p95 = percentile(durations, 0.95)
      console.log(
        `perf: ${req.method} ${req.path} p95=${p95.toFixed(1)}ms sample=${SAMPLE_SIZE}`,
      )
      durations.length = 0
    }
  })

  next()
}
