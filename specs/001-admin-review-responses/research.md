# Research Notes: Admin Review Responses

## Decision 1: Admin account setup flow

- Decision: Allow a one-time admin setup endpoint that creates the first Admin account; subsequent setup attempts are rejected.
- Rationale: Prevents open account creation while still supporting initial bootstrap without manual CSV edits.
- Alternatives considered: Manual CSV editing; always-open sign-up (rejected for security and auditability).

## Decision 2: Authentication method

- Decision: Use user ID + password with salted hashing (bcrypt) and issue a signed session token in an HTTP-only cookie for authenticated API calls.
- Rationale: Keeps credentials out of CSV plaintext and provides a simple, secure session model without extra storage.
- Alternatives considered: Basic auth (rejected due to repeated credential exposure); stateless JWT in local storage (rejected due to XSS risk).

## Decision 3: CSV schema organization

- Decision: Separate CSV files for `admin_users.csv`, `responses.csv`, `participants.csv`, and `collections.csv`, each with a versioned header row.
- Rationale: Keeps data auditable and readable while allowing independent evolution of schemas.
- Alternatives considered: Single CSV with mixed record types (rejected due to complexity and parsing risks).

## Decision 4: Response list vs. detail endpoints

- Decision: Provide a list endpoint returning summary fields and a detail endpoint for full response content.
- Rationale: Improves performance for large collections and aligns with the preview vs. detail UI.
- Alternatives considered: Single endpoint returning full responses (rejected due to payload size and slower list rendering).

## Decision 5: Response preview behavior

- Decision: Single click selects a response and shows a preview panel; double-click opens a full-detail view (route or modal).
- Rationale: Matches the requested interaction while preserving keyboard accessibility via explicit "Open details" action.
- Alternatives considered: Single click to open full details (rejected because preview is required).
