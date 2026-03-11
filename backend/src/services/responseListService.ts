import type { ResponseSummary } from '../models/response'
import { listResponses } from '../storage/responseStore'

type ResponseListResult = {
  items: ResponseSummary[]
  total: number
}

export const getResponseSummaries = async (
  limit: number,
  offset: number,
): Promise<ResponseListResult> => {
  const allResponses = await listResponses()
  const items = allResponses.slice(offset, offset + limit)

  return {
    items,
    total: allResponses.length,
  }
}
