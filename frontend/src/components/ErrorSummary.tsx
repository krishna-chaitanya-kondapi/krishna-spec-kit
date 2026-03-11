type ErrorSummaryItem = {
  id: string
  message: string
}

type ErrorSummaryProps = {
  items: ErrorSummaryItem[]
}

const ErrorSummary = ({ items }: ErrorSummaryProps) => {
  if (items.length === 0) {
    return null
  }

  return (
    <div
      className="error-summary"
      role="alert"
      aria-label="Form errors"
      tabIndex={-1}
    >
      <h2>Fix the following before submitting</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.message}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ErrorSummary
