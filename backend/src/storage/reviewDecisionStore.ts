import path from 'path'
import { env } from '../config/env'
import { appendCsvRow, ensureCsvFile, readCsv } from './csvStore'
import type { ReviewDecision, ReviewStatus } from '../models/review-decision'

const REVIEW_DECISIONS_HEADER = [
  'id',
  'enriched_response_id',
  'status',
  'note',
  'decided_by_admin_id',
  'decided_at',
]

const getReviewDecisionsPath = () =>
  path.join(env.DATA_DIR, 'review_decisions.csv')

const parseReviewStatus = (value: string): ReviewStatus => {
  if (value === 'Approved' || value === 'Rejected') {
    return value
  }
  return 'Pending'
}

const mapRowToReviewDecision = (row: Record<string, string>): ReviewDecision => ({
  id: row.id,
  enrichedResponseId: row.enriched_response_id,
  status: parseReviewStatus(row.status),
  note: row.note || null,
  decidedByAdminId: row.decided_by_admin_id,
  decidedAt: row.decided_at,
})

const serializeReviewDecision = (decision: ReviewDecision) => [
  decision.id,
  decision.enrichedResponseId,
  decision.status,
  decision.note ?? '',
  decision.decidedByAdminId,
  decision.decidedAt,
]

export const ensureReviewDecisionsFile = async () => {
  await ensureCsvFile(getReviewDecisionsPath(), REVIEW_DECISIONS_HEADER)
}

export const appendReviewDecision = async (decision: ReviewDecision) => {
  await ensureReviewDecisionsFile()
  await appendCsvRow(getReviewDecisionsPath(), serializeReviewDecision(decision))
}

export const listReviewDecisionsByResponseId = async (responseId: string) => {
  await ensureReviewDecisionsFile()
  const { rows } = await readCsv(getReviewDecisionsPath())

  return rows
    .map(mapRowToReviewDecision)
    .filter((decision) => decision.enrichedResponseId === responseId)
}
