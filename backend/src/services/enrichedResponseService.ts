import type { ResponseDetail } from '../models/response'
import type { EnrichedResponse } from '../models/enriched-response'
import type { ReviewDecision } from '../models/review-decision'
import { getResponseById } from '../storage/responseStore'
import {
  getEnrichedResponseById,
  upsertEnrichedResponse,
} from '../storage/enrichedResponseStore'
import { listReviewDecisionsByResponseId } from '../storage/reviewDecisionStore'

export type EnrichedResponseDetail = EnrichedResponse & {
  reviewHistory: ReviewDecision[]
}

type SurveyAnswers = {
  category?: string
  flexibility?: {
    suryanamaskaramsRating?: string
    comment?: string
  }
  strength?: {
    pushupsRating?: string
    plankRating?: string
    squatsRating?: string
    comment?: string
  }
  endurance?: {
    running3kRating?: string
    comment?: string
  }
  overallComment?: string
}

const formatValue = (value: string | undefined) => value?.trim() || 'N/A'

const buildResponseText = (response: ResponseDetail) => {
  const answers = response.answers as SurveyAnswers
  const lines = [
    `Category: ${formatValue(answers.category)}`,
    'Flexibility',
    `- Suryanamaskarams rating: ${formatValue(answers.flexibility?.suryanamaskaramsRating)}`,
    `- Comment: ${formatValue(answers.flexibility?.comment)}`,
    'Strength',
    `- Pushups rating: ${formatValue(answers.strength?.pushupsRating)}`,
    `- Plank rating: ${formatValue(answers.strength?.plankRating)}`,
    `- Squats rating: ${formatValue(answers.strength?.squatsRating)}`,
    `- Comment: ${formatValue(answers.strength?.comment)}`,
    'Endurance',
    `- 3K running rating: ${formatValue(answers.endurance?.running3kRating)}`,
    `- Comment: ${formatValue(answers.endurance?.comment)}`,
    `Overall comment: ${formatValue(answers.overallComment)}`,
  ]

  return lines.join('\n')
}

const buildEnrichedResponseFromSurvey = (response: ResponseDetail): EnrichedResponse => {
  const createdAt = response.submittedAt || new Date().toISOString()
  const originalText = buildResponseText(response)

  return {
    id: response.id,
    originalText,
    enrichedText: originalText,
    enrichmentContext: 'Auto-generated from survey response.',
    currentReviewStatus: 'Pending',
    createdAt,
    updatedAt: createdAt,
  }
}

export const ensureEnrichedResponse = async (responseId: string) => {
  const existing = await getEnrichedResponseById(responseId)
  if (existing) {
    return existing
  }

  const source = await getResponseById(responseId)
  if (!source) {
    return null
  }

  const created = buildEnrichedResponseFromSurvey(source)
  await upsertEnrichedResponse(created)
  return created
}

export const getEnrichedResponseDetail = async (
  responseId: string,
): Promise<EnrichedResponseDetail | null> => {
  const response = await ensureEnrichedResponse(responseId)
  if (!response) {
    return null
  }

  const history = await listReviewDecisionsByResponseId(responseId)
  const reviewHistory = [...history].sort((a, b) =>
    a.decidedAt.localeCompare(b.decidedAt),
  )

  return {
    ...response,
    reviewHistory,
  }
}
