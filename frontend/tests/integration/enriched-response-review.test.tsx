import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ResponseReviewPage from '../../src/pages/ResponseReviewPage'

const mockFetch = vi.fn()

global.fetch = mockFetch as unknown as typeof fetch

const jsonResponse = (status: number, payload: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(payload), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  )

describe('Enriched response review UI', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('submits a review decision from the detail view', async () => {
    mockFetch
      .mockImplementationOnce(() =>
        jsonResponse(200, {
          items: [
            {
              id: 'resp-1',
              participantId: 'resp-1',
              participantDisplayName: 'Juniors',
              submittedAt: '2026-03-03T12:00:00Z',
              preview: 'Great event',
            },
          ],
          total: 1,
        }),
      )
      .mockImplementationOnce(() =>
        jsonResponse(200, {
          id: 'resp-1',
          originalText: 'Category: Juniors',
          enrichedText: 'Category: Juniors',
          enrichmentContext: 'Auto-generated from survey response.',
          currentReviewStatus: 'Pending',
          reviewHistory: [],
        }),
      )
      .mockImplementationOnce(() =>
        jsonResponse(201, {
          id: 'rev-1',
          enrichedResponseId: 'resp-1',
          status: 'Approved',
          note: 'Looks good.',
          decidedByAdminId: 'admin',
          decidedAt: '2026-03-04T10:15:00Z',
        }),
      )

    render(
      <MemoryRouter>
        <ResponseReviewPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('Juniors')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('listitem', { name: /juniors/i }))
    fireEvent.doubleClick(screen.getByRole('listitem', { name: /juniors/i }))

    expect(await screen.findByText(/full response/i)).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/review status/i), {
      target: { value: 'Approved' },
    })
    fireEvent.change(screen.getByLabelText(/review note/i), {
      target: { value: 'Looks good.' },
    })

    fireEvent.click(screen.getByRole('button', { name: /save review/i }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3))

    const [url, options] = mockFetch.mock.calls[2]
    expect(url).toContain('/api/admin/enriched-responses/resp-1/reviews')
    expect(options?.method).toBe('POST')
  })
})
