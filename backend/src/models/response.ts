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
