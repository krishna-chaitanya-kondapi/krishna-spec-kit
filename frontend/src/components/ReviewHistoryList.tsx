import type { ReviewDecision } from '../services/apiClient'

type ReviewHistoryListProps = {
  history: ReviewDecision[]
}

const ReviewHistoryList = ({ history }: ReviewHistoryListProps) => {
  if (history.length === 0) {
    return <p className="review-history-empty">No reviews yet.</p>
  }

  return (
    <ul className="review-history">
      {history.map((entry) => (
        <li key={entry.id}>
          <div className="review-history-row">
            <span className="review-history-status">{entry.status}</span>
            <span className="review-history-meta">
              {new Date(entry.decidedAt).toLocaleString()} • {entry.decidedByAdminId}
            </span>
          </div>
          {entry.note ? <p className="review-history-note">{entry.note}</p> : null}
        </li>
      ))}
    </ul>
  )
}

export default ReviewHistoryList
