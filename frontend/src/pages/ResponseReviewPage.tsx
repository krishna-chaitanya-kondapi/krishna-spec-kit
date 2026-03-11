import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  EnrichedResponseDetail,
  ResponseSummary,
  ReviewDecisionPayload,
} from '../services/apiClient'
import {
  ApiError,
  fetchResponseDetail,
  fetchResponseList,
  logoutAdmin,
  submitReviewDecision,
} from '../services/apiClient'
import ResponsePreviewPanel from '../components/ResponsePreviewPanel'
import ResponseDetailView from '../components/ResponseDetailView'
import ResponseListItem from '../components/ResponseListItem'
import '../styles/admin-review.css'

const DEFAULT_COLLECTION_ID = 'feedback-survey'

const ResponseReviewPage = () => {
  const navigate = useNavigate()
  const [responses, setResponses] = useState<ResponseSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const pageSize = 10
  const previewRef = useRef<HTMLElement | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<EnrichedResponseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    let active = true
    const loadResponses = async () => {
      setLoading(true)
      setError(null)
      setAuthError(false)

      try {
        const data = await fetchResponseList(DEFAULT_COLLECTION_ID, {
          limit: pageSize,
          offset: page * pageSize,
        })
        if (!active) return
        setResponses(data.items)
        setTotal(data.total)
      } catch (err) {
        if (!active) return
        if (err instanceof ApiError && err.status === 401) {
          setAuthError(true)
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load responses.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadResponses()

    return () => {
      active = false
    }
  }, [page])

  const selectedResponse = useMemo(
    () => responses.find((item) => item.id === selectedId) ?? null,
    [responses, selectedId],
  )

  useEffect(() => {
    if (selectedResponse) {
      previewRef.current?.focus()
    }
  }, [selectedResponse])

  const handleOpenDetail = async () => {
    if (!selectedResponse) return
    try {
      const detailData = await fetchResponseDetail(selectedResponse.id)
      setDetail(detailData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load details.')
    }
  }

  const handleSubmitReview = async (payload: ReviewDecisionPayload) => {
    if (!detail) return
    await submitReviewDecision(detail.id, payload)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login')
  }

  if (authError) {
    return (
      <main className="admin-page">
        <section className="admin-card">
          <h1>Admin access required</h1>
          <p>Please log in to review responses.</p>
          <button type="button" onClick={() => navigate('/admin/login')}>
            Go to login
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="admin-review">
      <header className="admin-review-header">
        <div>
          <p className="admin-tag">Admin Review</p>
          <h1>Participant responses</h1>
          <p>Single click for preview. Double click for full details.</p>
        </div>
        <button type="button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="admin-review-body">
        <div className="response-list" role="list">
          {loading ? (
            <p>Loading responses...</p>
          ) : responses.length === 0 ? (
            <p>No responses yet.</p>
          ) : (
            responses.map((response) => (
              <ResponseListItem
                key={response.id}
                response={response}
                selected={response.id === selectedId}
                onSelect={() => {
                  setSelectedId(response.id)
                  setDetail(null)
                }}
                onOpenDetail={handleOpenDetail}
              />
            ))
          )}
          {total > pageSize ? (
            <div className="response-pagination">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
              >
                Previous
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
                }
                disabled={page + 1 >= totalPages}
              >
                Next
              </button>
            </div>
          ) : null}
        </div>

        <div className="response-panels">
          <ResponsePreviewPanel
            response={selectedResponse}
            onOpenDetail={handleOpenDetail}
            ref={previewRef}
          />
          <ResponseDetailView
            response={detail}
            summary={selectedResponse}
            onSubmitReview={detail ? handleSubmitReview : undefined}
          />
          {error ? <div className="admin-error">{error}</div> : null}
        </div>
      </section>
    </main>
  )
}

export default ResponseReviewPage
