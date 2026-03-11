import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminSetupPage from '../src/pages/AdminSetupPage'
import AdminLoginPage from '../src/pages/AdminLoginPage'
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

describe('Admin review flow UI', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('submits admin setup', async () => {
    mockFetch.mockImplementationOnce(() => jsonResponse(201, { message: 'ok' }))

    render(
      <MemoryRouter>
        <AdminSetupPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/user id/i), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /create admin/i }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
  })

  it('submits admin login', async () => {
    mockFetch.mockImplementationOnce(() => jsonResponse(200, { message: 'ok' }))

    render(
      <MemoryRouter>
        <AdminLoginPage />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText(/user id/i), {
      target: { value: 'admin' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalled())
  })

  it('shows list preview and detail', async () => {
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
          originalText: 'Original response text',
          enrichedText: 'Enriched response text',
          enrichmentContext: 'Auto-generated from survey response.',
          currentReviewStatus: 'Pending',
          reviewHistory: [],
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

    expect(
      await screen.findByRole('heading', { name: /full response/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /original response/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { name: /enriched response/i }),
    ).toBeInTheDocument()
  })
})
