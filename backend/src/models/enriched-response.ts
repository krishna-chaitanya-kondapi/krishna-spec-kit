import type { ReviewStatus } from './review-decision'

export type EnrichedResponse = {
  id: string
  originalText: string
  enrichedText: string
  enrichmentContext: string
  currentReviewStatus: ReviewStatus
  createdAt: string
  updatedAt: string
}
