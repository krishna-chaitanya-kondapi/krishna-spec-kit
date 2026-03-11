# Data Model: Admin Enrich Response Review Panel

## Entities

### EnrichedResponse

- Represents a single response after enrichment.
- Fields:
  - id
  - originalText
  - enrichedText
  - enrichmentContext
  - currentReviewStatus (Pending, Approved, Rejected)
  - createdAt
  - updatedAt

### ReviewDecision

- Represents a single admin review action.
- Fields:
  - id
  - enrichedResponseId
  - status (Pending, Approved, Rejected)
  - note (optional)
  - decidedByAdminId
  - decidedAt

### ReviewAuditEntry

- Represents the historical record of review decisions for an enriched response.
- Fields:
  - id
  - enrichedResponseId
  - status
  - note (optional)
  - decidedByAdminId
  - decidedAt

## Relationships

- EnrichedResponse has many ReviewDecision entries.
- ReviewAuditEntry mirrors ReviewDecision entries for display and audit queries.

## Validation Rules

- Review status must be one of Pending, Approved, or Rejected.
- Review note is optional.
- Enriched response text and context must be present to render the detail view.

## State Transitions

- CurrentReviewStatus is updated to the latest ReviewDecision status.
- Every status change creates a new ReviewDecision and ReviewAuditEntry.
