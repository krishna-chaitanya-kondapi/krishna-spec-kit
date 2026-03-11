import { forwardRef } from 'react'
import type { ResponseSummary } from '../services/apiClient'

type ResponsePreviewPanelProps = {
  response: ResponseSummary | null
  onOpenDetail: () => void
}

const ResponsePreviewPanel = forwardRef<HTMLElement, ResponsePreviewPanelProps>(
  ({ response, onOpenDetail }, ref) => {
  if (!response) {
    return (
      <section
        ref={ref}
        className="response-preview"
        aria-live="polite"
        tabIndex={-1}
      >
        <p>Select a response to preview.</p>
      </section>
    )
  }

  return (
    <section
      ref={ref}
      className="response-preview"
      aria-live="polite"
      aria-labelledby="response-preview-title"
      tabIndex={-1}
    >
      <h2 id="response-preview-title">Preview</h2>
      <p className="response-meta">
        {response.participantDisplayName} •{' '}
        {new Date(response.submittedAt).toLocaleString()}
      </p>
      <p>{response.preview}</p>
      <button type="button" onClick={onOpenDetail}>
        Open details
      </button>
    </section>
  )
  },
)

ResponsePreviewPanel.displayName = 'ResponsePreviewPanel'

export default ResponsePreviewPanel
