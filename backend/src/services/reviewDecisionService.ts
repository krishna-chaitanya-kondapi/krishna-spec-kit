import { randomUUID } from 'crypto'
import type { ReviewDecision, ReviewStatus } from '../models/review-decision'
import { appendReviewDecision } from '../storage/reviewDecisionStore'
import { upsertEnrichedResponse } from '../storage/enrichedResponseStore'
import { ensureEnrichedResponse } from './enrichedResponseService'

type CreateReviewDecisionInput = {
  enrichedResponseId: string
  status: ReviewStatus
  note?: string
  adminId: string
}

export const createReviewDecision = async ({
  enrichedResponseId,
  status,
  note,
  adminId,
}: CreateReviewDecisionInput) => {
  const enrichedResponse = await ensureEnrichedResponse(enrichedResponseId)
  if (!enrichedResponse) {
    return null
  }

  const decidedAt = new Date().toISOString()
  const decision: ReviewDecision = {
    id: randomUUID(),
    enrichedResponseId,
    status,
    note: note?.trim() ? note.trim() : null,
    decidedByAdminId: adminId,
    decidedAt,
  }

  await appendReviewDecision(decision)
  await upsertEnrichedResponse({
    ...enrichedResponse,
    currentReviewStatus: status,
    updatedAt: decidedAt,
  })

  return decision
}
