export type ReviewStatus = 'Pending' | 'Approved' | 'Rejected'

export type ReviewDecision = {
  id: string
  enrichedResponseId: string
  status: ReviewStatus
  note: string | null
  decidedByAdminId: string
  decidedAt: string
}
