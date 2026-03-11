export type AdminAuthPayload = {
  userId: string
  password: string
}

export type ResponseSummary = {
  id: string
  participantId: string
  participantDisplayName: string
  submittedAt: string
  preview: string
}

export type ResponseDetail = {
  id: string
  collectionId: string
  participantId: string
  participantDisplayName: string
  submittedAt: string
  answers: Record<string, unknown>
}

export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected'

export type ReviewDecision = {
  id: string
  enrichedResponseId: string
  status: ReviewStatus
  note: string | null
  decidedByAdminId: string
  decidedAt: string
}

export type ReviewDecisionPayload = {
  status: ReviewStatus
  note?: string
}

export type EnrichedResponseDetail = {
  id: string
  originalText: string
  enrichedText: string
  enrichmentContext: string
  currentReviewStatus: ReviewStatus
  reviewHistory: ReviewDecision[]
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const parseErrorMessage = async (response: Response) => {
  try {
    const data = (await response.json()) as { error?: { message?: string } }
    return data?.error?.message || response.statusText
  } catch {
    return response.statusText
  }
}

const requestJson = async <T>(input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return null as T
  }

  return (await response.json()) as T
}

export const setupAdmin = (payload: AdminAuthPayload) =>
  requestJson<{ message: string }>('/api/admin/setup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const loginAdmin = (payload: AdminAuthPayload) =>
  requestJson<{ message: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const logoutAdmin = () =>
  requestJson<void>('/api/admin/logout', { method: 'POST' })

export const fetchResponseList = (
  collectionId: string,
  options?: { limit?: number; offset?: number },
) => {
  const params = new URLSearchParams()
  if (options?.limit !== undefined) {
    params.set('limit', String(options.limit))
  }
  if (options?.offset !== undefined) {
    params.set('offset', String(options.offset))
  }

  const query = params.toString()

  return requestJson<{ items: ResponseSummary[]; total: number }>(
    `/api/collections/${collectionId}/responses${query ? `?${query}` : ''}`,
  )
}

export const fetchResponseDetail = (responseId: string) =>
  requestJson<EnrichedResponseDetail>(
    `/api/admin/enriched-responses/${responseId}`,
  )

export const submitReviewDecision = (
  responseId: string,
  payload: ReviewDecisionPayload,
) =>
  requestJson<ReviewDecision>(
    `/api/admin/enriched-responses/${responseId}/reviews`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  )
