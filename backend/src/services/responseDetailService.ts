import type { ResponseDetail } from '../models/response'
import { getResponseById } from '../storage/responseStore'

export const getResponseDetail = async (
  responseId: string,
): Promise<ResponseDetail | null> => {
  return getResponseById(responseId)
}
