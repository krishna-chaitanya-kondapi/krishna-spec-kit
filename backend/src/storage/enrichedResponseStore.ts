import { promises as fs } from 'fs'
import path from 'path'
import { env } from '../config/env'
import { appendCsvRow, ensureCsvFile, readCsv } from './csvStore'
import type { EnrichedResponse } from '../models/enriched-response'
import type { ReviewStatus } from '../models/review-decision'

const ENRICHED_RESPONSES_HEADER = [
  'id',
  'original_text',
  'enriched_text',
  'enrichment_context',
  'current_review_status',
  'created_at',
  'updated_at',
]

const getEnrichedResponsesPath = () =>
  path.join(env.DATA_DIR, 'enriched_responses.csv')

const parseReviewStatus = (value: string): ReviewStatus => {
  if (value === 'Approved' || value === 'Rejected') {
    return value
  }
  return 'Pending'
}

const mapRowToEnrichedResponse = (row: Record<string, string>): EnrichedResponse => ({
  id: row.id,
  originalText: row.original_text,
  enrichedText: row.enriched_text,
  enrichmentContext: row.enrichment_context,
  currentReviewStatus: parseReviewStatus(row.current_review_status),
  createdAt: row.created_at,
  updatedAt: row.updated_at || row.created_at,
})

const serializeEnrichedResponse = (response: EnrichedResponse) => [
  response.id,
  response.originalText,
  response.enrichedText,
  response.enrichmentContext,
  response.currentReviewStatus,
  response.createdAt,
  response.updatedAt,
]

const writeAllEnrichedResponses = async (responses: EnrichedResponse[]) => {
  const filePath = getEnrichedResponsesPath()
  await fs.writeFile(filePath, `${ENRICHED_RESPONSES_HEADER.join(',')}\n`, 'utf-8')

  for (const response of responses) {
    await appendCsvRow(filePath, serializeEnrichedResponse(response))
  }
}

export const ensureEnrichedResponsesFile = async () => {
  await ensureCsvFile(getEnrichedResponsesPath(), ENRICHED_RESPONSES_HEADER)
}

export const listEnrichedResponses = async () => {
  await ensureEnrichedResponsesFile()
  const { rows } = await readCsv(getEnrichedResponsesPath())
  return rows.map(mapRowToEnrichedResponse)
}

export const getEnrichedResponseById = async (responseId: string) => {
  const responses = await listEnrichedResponses()
  return responses.find((item) => item.id === responseId) ?? null
}

export const upsertEnrichedResponse = async (response: EnrichedResponse) => {
  const responses = await listEnrichedResponses()
  const index = responses.findIndex((item) => item.id === response.id)

  if (index >= 0) {
    responses[index] = response
  } else {
    responses.push(response)
  }

  await writeAllEnrichedResponses(responses)
  return response
}
