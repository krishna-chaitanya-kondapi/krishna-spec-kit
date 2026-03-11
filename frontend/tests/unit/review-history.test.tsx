import { render, screen } from '@testing-library/react'
import ResponseDetailView from '../../src/components/ResponseDetailView'

const detail = {
  id: 'resp-1',
  originalText: 'Original response text',
  enrichedText: 'Enriched response text',
  enrichmentContext: 'Auto-generated from survey response.',
  currentReviewStatus: 'Pending',
  reviewHistory: [
    {
      id: 'rev-1',
      enrichedResponseId: 'resp-1',
      status: 'Pending',
      note: 'First check',
      decidedByAdminId: 'admin',
      decidedAt: '2026-03-04T10:10:00Z',
    },
  ],
}

describe('Review history list', () => {
  it('renders review history entries', () => {
    render(<ResponseDetailView response={detail} />)

    expect(screen.getByText(/review history/i)).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('First check')).toBeInTheDocument()
  })
})
