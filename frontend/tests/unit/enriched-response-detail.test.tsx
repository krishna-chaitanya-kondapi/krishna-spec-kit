import { render, screen } from '@testing-library/react'
import ResponseDetailView from '../../src/components/ResponseDetailView'

const detail = {
  id: 'resp-1',
  originalText: 'Original response text',
  enrichedText: 'Enriched response text',
  enrichmentContext: 'Auto-generated from survey response.',
  currentReviewStatus: 'Pending',
  reviewHistory: [],
}

describe('Enriched response detail view', () => {
  it('renders a visual layout for enriched responses', () => {
    render(<ResponseDetailView response={detail} />)

    expect(
      screen.getByRole('heading', { name: /original response/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /enriched response/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /enrichment context/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Original response text')).toBeInTheDocument()
    expect(screen.getByText('Enriched response text')).toBeInTheDocument()
  })
})
