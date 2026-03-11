# Research: Trifit Janakul Health Challenge Feedback Survey

**Date**: 2026-03-03

## React + Vite + TypeScript Survey Form

- **Decision**: Use native form elements with `fieldset`/`legend` grouping and
  React Hook Form + Zod for validation.
- **Rationale**: Native controls provide best accessibility; React Hook Form
  minimizes re-renders for large forms; Zod offers type-safe validation.
- **Alternatives considered**: Formik, TanStack Form; custom validation without
  schema library.

- **Decision**: Provide inline errors plus a top-of-form error summary linked to
  invalid fields.
- **Rationale**: Meets WCAG 2.1 AA guidance for error identification and focus
  management.
- **Alternatives considered**: Inline-only errors, toast-only errors.

## Express REST API Validation & Security

- **Decision**: Centralize request validation and sanitization via schema-based
  middleware with consistent JSON error responses.
- **Rationale**: Reduces unsafe inputs, provides predictable client handling,
  and aligns with security-first requirements.
- **Alternatives considered**: Ad-hoc validation in route handlers.

- **Decision**: Use `helmet`, rate limiting, and strict body size limits on
  submission endpoints.
- **Rationale**: Hardens the API and keeps request processing within the
  <200ms p95 budget.
- **Alternatives considered**: Relying on defaults or proxy-only protection.

## CSV Persistence

- **Decision**: Serialize writes through a single writer/queue and append rows
  atomically, with a `schema_version` column in the CSV header.
- **Rationale**: Prevents interleaving writes, keeps the CSV auditable, and
  enables forward-compatible schema evolution.
- **Alternatives considered**: Full file rewrite per submission, multi-process
  writes, or direct client-side CSV writes.

- **Decision**: Validate and normalize data before writing to CSV.
- **Rationale**: Protects against malformed or unsafe input and keeps reports
  reliable.
- **Alternatives considered**: Writing raw user input and cleaning later.
