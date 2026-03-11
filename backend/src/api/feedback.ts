import path from 'path'
import { Router } from 'express'
import { env } from '../config/env'
import { HttpError } from '../middleware/error-handler'
import { appendCsvRow } from '../services/csv-writer'
import { mapFeedbackToCsv } from '../services/feedback-mapper'
import { feedbackSchema } from '../validators/feedback-schema'

export const feedbackRouter = Router()

feedbackRouter.post('/feedback', async (req, res, next) => {
  const parsed = feedbackSchema.safeParse(req.body)

  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      issue: issue.message,
    }))

    return next(
      new HttpError(
        400,
        'VALIDATION_ERROR',
        'One or more fields are invalid.',
        details,
      ),
    )
  }

  try {
    const { row, submissionId, submittedAt } = mapFeedbackToCsv(parsed.data)
    const csvPath = path.join(env.DATA_DIR, 'submissions.csv')

    await appendCsvRow(csvPath, row)

    res.status(201).json({
      submissionId,
      message: 'Feedback recorded',
      submittedAt,
    })
  } catch (error) {
    next(error)
  }
})
