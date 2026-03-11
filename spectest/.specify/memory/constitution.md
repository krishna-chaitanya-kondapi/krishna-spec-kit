<!--
Sync Impact Report
- Version: 1.0.0 -> 1.1.0
- Modified principles: None (clarified wording only)
- Added sections: None
- Removed sections: None
- Templates updated: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->
# Trifit Janakul Health Challenge 2026 - Participant Feedback Constitution

## Core Principles

### I. Security-First by Default
All user data is treated as sensitive. Inputs MUST be validated and sanitized on
both client and server. Data handling MUST follow least-privilege access,
explicit allowlists, and secure defaults. No feature ships without threat
modeling notes and secure error handling. Rationale: survey data can expose
health-related information.

### II. Test-First and Coverage for Critical Paths
Tests MUST be written before implementation for core logic, CSV persistence, and
API routes. Unit tests cover validation and transformation; integration tests
cover API-to-CSV flows; UI tests cover the main survey completion path and error
states. Rationale: regressions in data capture and flow are high impact.

### III. Accessibility is a Feature
UI MUST meet WCAG 2.1 AA. All interactive elements are keyboard navigable, have
visible focus states, and use correct ARIA where needed. Forms have clear labels,
instructions, and error messaging that is screen-reader friendly. Rationale:
competition submissions require inclusive access.

### IV. Performance Budgets are Non-Negotiable
API endpoints MUST respond under 200ms for the p95 on representative hardware.
Performance regressions require profiling and mitigation before release. Client
bundles stay lean with code-splitting and audit-driven improvements. Rationale:
fast responses reduce survey abandonment.

### V. Simplicity and Auditable Data
CSV persistence MUST remain transparent, deterministic, and easy to inspect.
Data schema is versioned and backward-compatible. Prefer simple, readable
implementations over clever abstractions. Rationale: audits depend on clarity.

## Technical Constraints

- Front-end: React with Vite and TypeScript.
- Middle layer: Express.js REST API.
- Persistence: CSV files stored locally, with explicit file paths and safe write
	semantics.
- No client-side direct file writes; all persistence goes through the API.
- All external dependencies must have documented purpose and security review
	notes.

## Delivery Workflow and Quality Gates

- Every change includes a brief risk note and test plan in the PR.
- CI must pass: lint, type-check, unit tests, and integration tests.
- Accessibility checks include automated audits and manual keyboard walkthroughs
	for key flows.
- Performance checks include a p95 timing report for API endpoints and bundle
	size checks.

## Governance

This constitution supersedes all other practices and templates.

Amendments require:
- A documented proposal with rationale and impact analysis.
- Approval by the project owner or designated reviewer.
- A migration or remediation plan if behavior changes.

Versioning follows semantic versioning:
- MAJOR: incompatible governance change or principle removal/redefinition.
- MINOR: new principle or material guidance expansion.
- PATCH: clarifications, wording, or non-semantic refinements.

Compliance review is required for every PR:
- Confirm security notes and tests for critical paths.
- Confirm WCAG 2.1 AA checks for UI changes.
- Confirm performance checks for API changes.

**Version**: 1.1.0 | **Ratified**: 2026-03-03 | **Last Amended**: 2026-03-03
