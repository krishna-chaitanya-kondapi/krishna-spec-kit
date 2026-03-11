import { useState } from 'react'
import type {
  ReviewDecisionPayload,
  ReviewStatus,
} from '../services/apiClient'

type ReviewDecisionFormProps = {
  onSubmit: (payload: ReviewDecisionPayload) => Promise<void>
  currentStatus?: ReviewStatus
}

const ReviewDecisionForm = ({
  onSubmit,
  currentStatus = 'Pending',
}: ReviewDecisionFormProps) => {
  const [status, setStatus] = useState<ReviewStatus>(currentStatus)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await onSubmit({
        status,
        note: note.trim() ? note.trim() : undefined,
      })
      setSuccess(true)
      setNote('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save review.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <label>
        Review status
        <select
          name="reviewStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value as ReviewStatus)}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </label>

      <label>
        Review note
        <textarea
          name="reviewNote"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
      </label>

      <div className="review-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save review'}
        </button>
        {success ? <span className="review-success">Saved.</span> : null}
      </div>
      {error ? <p className="review-error">{error}</p> : null}
    </form>
  )
}

export default ReviewDecisionForm
