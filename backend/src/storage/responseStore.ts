import path from 'path'
import { env } from '../config/env'
import { readCsv } from './csvStore'
import type { ResponseDetail, ResponseSummary } from '../models/response'

const RESPONSES_FILE = 'submissions.csv'
const DEFAULT_COLLECTION_ID = 'feedback-survey'

const buildPreview = (row: Record<string, string>) => {
  const candidates = [
    row.overall_comment,
    row.flexibility_comment,
    row.strength_comment,
    row.endurance_comment,
  ].map((value) => value?.trim())

  const text = candidates.find((value) => value) ?? ''
  if (!text) return 'No comments provided.'
  return text.length > 140 ? `${text.slice(0, 137)}...` : text
}

const mapRowToSummary = (row: Record<string, string>): ResponseSummary => ({
  id: row.submission_id,
  participantId: row.submission_id,
  participantDisplayName: row.category || 'Anonymous',
  submittedAt: row.submitted_at,
  preview: buildPreview(row),
})

const mapRowToDetail = (row: Record<string, string>): ResponseDetail => ({
  id: row.submission_id,
  collectionId: DEFAULT_COLLECTION_ID,
  participantId: row.submission_id,
  participantDisplayName: row.category || 'Anonymous',
  submittedAt: row.submitted_at,
  answers: {
    category: row.category,
    flexibility: {
      suryanamaskaramsRating: row.flexibility_suryanamaskarams_rating,
      comment: row.flexibility_comment,
    },
    strength: {
      pushupsRating: row.strength_pushups_rating,
      plankRating: row.strength_plank_rating,
      squatsRating: row.strength_squats_rating,
      comment: row.strength_comment,
    },
    endurance: {
      running3kRating: row.endurance_3k_running_rating,
      comment: row.endurance_comment,
    },
    overallComment: row.overall_comment,
  },
})

export const listResponses = async () => {
  const csvPath = path.join(env.DATA_DIR, RESPONSES_FILE)
  const { rows } = await readCsv(csvPath)
  return rows.map(mapRowToSummary)
}

export const getResponseById = async (responseId: string) => {
  const csvPath = path.join(env.DATA_DIR, RESPONSES_FILE)
  const { rows } = await readCsv(csvPath)
  const row = rows.find((item) => item.submission_id === responseId)
  return row ? mapRowToDetail(row) : null
}
