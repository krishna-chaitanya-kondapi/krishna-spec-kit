import { randomUUID } from 'crypto'
import type { FeedbackPayload } from '../validators/feedback-schema'

const SCHEMA_VERSION = '1.0'

const escapeCsv = (value: string | number | undefined | null) => {
  const text = value === undefined || value === null ? '' : String(value)
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const getRating = (
  payload: FeedbackPayload,
  sectionName: string,
  activityName: string,
) => {
  const section = payload.sectionResponses.find(
    (item) => item.sectionName === sectionName,
  )
  const activity = section?.activityRatings.find(
    (item) => item.activityName === activityName,
  )
  return activity?.rating ?? ''
}

const getSectionComment = (payload: FeedbackPayload, sectionName: string) =>
  payload.sectionResponses.find((item) => item.sectionName === sectionName)
    ?.sectionComment ?? ''

export const mapFeedbackToCsv = (payload: FeedbackPayload) => {
  const submissionId = randomUUID()
  const submittedAt = new Date().toISOString()

  const row = [
    SCHEMA_VERSION,
    submissionId,
    payload.category,
    submittedAt,
    getRating(payload, 'Flexibility', 'Suryanamaskarams'),
    getSectionComment(payload, 'Flexibility'),
    getRating(payload, 'Strength', 'Pushups'),
    getRating(payload, 'Strength', 'Plank'),
    getRating(payload, 'Strength', 'Squats'),
    getSectionComment(payload, 'Strength'),
    getRating(payload, 'Endurance', '3K Running'),
    getSectionComment(payload, 'Endurance'),
    payload.overallComment ?? '',
  ]
    .map(escapeCsv)
    .join(',')

  return { row, submissionId, submittedAt }
}
