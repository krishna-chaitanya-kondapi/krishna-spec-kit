import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ResponseReviewPage from '../src/pages/ResponseReviewPage'

const mockFetch = vi.fn()

global.fetch = mockFetch as unknown as typeof fetch

const jsonResponse = (status: number, payload: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )

describe('Response list pagination UI', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('shows paging controls when total exceeds page size', async () => {
    const items = Array.from({ length: 10 }, (_, index) => ({
      id: `resp-${index}`,
      participantId: `resp-${index}`,
      participantDisplayName: `Participant ${index + 1}`,
      submittedAt: '2026-03-03T12:00:00Z',
      preview: 'Preview text',
    }))

    mockFetch.mockImplementationOnce(() => jsonResponse(200, { items, total: 11 }))

    render(
      <MemoryRouter>
        <ResponseReviewPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText(/page 1 of 2/i)).toBeInTheDocument()
  })
})
