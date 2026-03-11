# Research: Admin Enrich Response Review Panel

## Decision 1: UI stack remains React + Vite + TypeScript

- Decision: Use the existing React 19 + Vite 7 + TypeScript stack for the admin detailed view.
- Rationale: Aligns with current frontend architecture and avoids introducing a second UI stack.
- Alternatives considered: Next.js, server-rendered templates.

## Decision 2: REST API on Express with Zod validation

- Decision: Implement review endpoints as REST routes in Express and validate payloads with Zod.
- Rationale: Matches current backend patterns and provides consistent input validation.
- Alternatives considered: GraphQL, tRPC.

## Decision 3: CSV persistence for review decisions and audit history

- Decision: Persist review decisions and audit entries in CSV files alongside existing data storage.
- Rationale: The constitution mandates CSV persistence with transparent and auditable data.
- Alternatives considered: SQLite, PostgreSQL.

## Decision 4: Testing strategy uses Jest and Vitest

- Decision: Backend tests use Jest; frontend tests use Vitest with React Testing Library.
- Rationale: These tools are already configured in the repo and align with current test workflow.
- Alternatives considered: Mocha/Chai, Playwright-only testing.
