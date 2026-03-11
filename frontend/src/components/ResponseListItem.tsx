import type { ResponseSummary } from '../services/apiClient'

type ResponseListItemProps = {
  response: ResponseSummary
  selected: boolean
  onSelect: () => void
  onOpenDetail: () => void
}

const ResponseListItem = ({
  response,
  selected,
  onSelect,
  onOpenDetail,
}: ResponseListItemProps) => (
  <button
    type="button"
    role="listitem"
    aria-label={response.participantDisplayName}
    className={selected ? 'response-item selected' : 'response-item'}
    onClick={onSelect}
    onDoubleClick={onOpenDetail}
    onKeyDown={(event) => {
      if (event.key === 'Enter') {
        onOpenDetail()
      }
    }}
  >
    <span className="response-name">{response.participantDisplayName}</span>
    <span className="response-time">
      {new Date(response.submittedAt).toLocaleString()}
    </span>
  </button>
)

export default ResponseListItem
