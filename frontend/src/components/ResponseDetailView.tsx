import type {
  EnrichedResponseDetail,
  ResponseSummary,
  ReviewDecisionPayload,
} from '../services/apiClient'
import ReviewDecisionForm from './ReviewDecisionForm'
import ReviewHistoryList from './ReviewHistoryList'

type ResponseDetailViewProps = {
  response: EnrichedResponseDetail | null
  summary?: ResponseSummary | null
  onSubmitReview?: (payload: ReviewDecisionPayload) => Promise<void>
}

const ResponseDetailView = ({
  response,
  summary = null,
  onSubmitReview,
}: ResponseDetailViewProps) => {
  if (!response) {
    return null
  }

  return (
    <section className="response-detail" aria-live="polite">
      <h2>Full response</h2>
      {summary ? (
        <p className="response-meta">
          {summary.participantDisplayName} •{' '}
          {new Date(summary.submittedAt).toLocaleString()}
        </p>
      ) : null}
      <div className="detail-section">
        <h3>Original response</h3>
        <pre className="detail-text">{response.originalText}</pre>
      </div>
      <div className="detail-section">
        <h3>Enriched response</h3>
        <pre className="detail-text">{response.enrichedText}</pre>
      </div>
      <div className="detail-section">
        <h3>Enrichment context</h3>
        <p className="detail-context">{response.enrichmentContext}</p>
      </div>
      <div className="detail-section">
        <h3>Review history</h3>
        <ReviewHistoryList history={response.reviewHistory} />
      </div>
      {onSubmitReview ? (
        <ReviewDecisionForm onSubmit={onSubmitReview} />
      ) : null}
    </section>
  )
}

export default ResponseDetailView
