---
description: "Task list for Admin Enrich Response Review Panel"
---

# Tasks: Admin Enrich Response Review Panel

**Input**: Design documents from /specs/002-enrich-response-admin-view/
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for critical paths per the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: [ID] [P?] [Story] Description

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Each task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Update CSV initialization for enriched responses and review decisions in backend/src/services/csv-init.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T002 [P] Add enriched response model in backend/src/models/enriched-response.ts
- [x] T003 [P] Add review decision model in backend/src/models/review-decision.ts
- [x] T004 [P] Add storage helpers for enriched responses in backend/src/storage/enrichedResponseStore.ts
- [x] T005 [P] Add storage helpers for review decisions in backend/src/storage/reviewDecisionStore.ts
- [x] T006 [P] Add review payload validation schema in backend/src/validators/review-schema.ts
- [x] T007 Add enriched response and review services in backend/src/services/enrichedResponseService.ts and backend/src/services/reviewDecisionService.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Review and Decide (Priority: P1) MVP

**Goal**: Admins can record review decisions with optional notes and persist them.

**Independent Test**: Open the detail view, submit Approved or Rejected with a note, refresh, and verify the decision persists.

### Tests for User Story 1 (REQUIRED) 

- [x] T008 [P] [US1] Contract test for POST /api/admin/enriched-responses/{id}/reviews in backend/tests/contract/enriched-response-review.test.ts
- [x] T009 [P] [US1] Integration test for review persistence in backend/tests/integration/enriched-response-review.test.ts
- [x] T010 [P] [US1] Frontend integration test for review submission in frontend/tests/integration/enriched-response-review.test.tsx

### Implementation for User Story 1

- [x] T011 [US1] Add POST route handler for reviews with requireAdmin in backend/src/api/responseRoutes.ts
- [x] T012 [US1] Implement review persistence logic in backend/src/services/reviewDecisionService.ts
- [x] T013 [P] [US1] Add review API client method and types in frontend/src/services/apiClient.ts
- [x] T014 [P] [US1] Create review controls component in frontend/src/components/ReviewDecisionForm.tsx
- [x] T015 [US1] Integrate review controls into frontend/src/components/ResponseDetailView.tsx and frontend/src/pages/ResponseReviewPage.tsx

**Checkpoint**: User Story 1 should be functional and testable independently

---

## Phase 4: User Story 2 - Compare Content and Context (Priority: P2)

**Goal**: Admins can view original vs enriched responses with context in a visual layout.

**Independent Test**: Open a detail view and confirm original, enriched, and context sections render in a human-readable layout (no JSON).

### Tests for User Story 2 (REQUIRED)

- [x] T016 [P] [US2] Contract test for GET /api/admin/enriched-responses/{id} in backend/tests/contract/enriched-response-detail.test.ts
- [x] T017 [P] [US2] Integration test for detail payload shape in backend/tests/integration/enriched-response-detail.test.ts
- [x] T018 [P] [US2] Frontend unit test for visual detail layout in frontend/tests/unit/enriched-response-detail.test.tsx

### Implementation for User Story 2

- [x] T019 [US2] Add GET route handler for enriched response detail in backend/src/api/responseRoutes.ts
- [x] T020 [US2] Implement enriched response detail fetch in backend/src/services/enrichedResponseService.ts
- [x] T021 [P] [US2] Add enriched response detail API client method and types in frontend/src/services/apiClient.ts
- [x] T022 [US2] Replace JSON rendering with visual layout in frontend/src/components/ResponseDetailView.tsx
- [x] T023 [P] [US2] Add styles for visual detail layout in frontend/src/styles/admin-review.css

**Checkpoint**: User Stories 1 and 2 should be independently functional

---

## Phase 5: User Story 3 - Audit Trail Visibility (Priority: P3)

**Goal**: Admins can view a chronological audit trail of review decisions.

**Independent Test**: Submit two review decisions and verify the audit trail lists both in order.

### Tests for User Story 3 (REQUIRED)

- [x] T024 [P] [US3] Backend unit test for review history ordering in backend/tests/unit/review-history.test.ts
- [x] T025 [P] [US3] Frontend unit test for audit trail rendering in frontend/tests/unit/review-history.test.tsx

### Implementation for User Story 3

- [x] T026 [US3] Include review history ordering in backend/src/services/enrichedResponseService.ts
- [x] T027 [P] [US3] Create audit trail component in frontend/src/components/ReviewHistoryList.tsx
- [x] T028 [US3] Render audit trail in frontend/src/components/ResponseDetailView.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T029 [P] Accessibility pass for review controls and detail layout in frontend/src/components/ReviewDecisionForm.tsx and frontend/src/components/ResponseDetailView.tsx
- [x] T030 [P] Validate quickstart steps and update specs/002-enrich-response-admin-view/quickstart.md if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Phase 6)**: Depends on completion of desired user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2); no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2); independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2); independent of US1/US2

### Parallel Opportunities

- Phase 2 tasks marked [P] can run in parallel
- Within each user story, tests marked [P] can run in parallel
- UI component tasks and API client tasks can run in parallel once types are defined

---

## Parallel Example: User Story 1

```text
Task: T008 Contract test for POST /api/admin/enriched-responses/{id}/reviews in backend/tests/contract/enriched-response-review.test.ts
Task: T009 Integration test for review persistence in backend/tests/integration/enriched-response-review.test.ts
Task: T010 Frontend integration test for review submission in frontend/tests/integration/enriched-response-review.test.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate User Story 1 independently

### Incremental Delivery

1. Setup + Foundational
2. User Story 1 -> test -> demo
3. User Story 2 -> test -> demo
4. User Story 3 -> test -> demo
5. Polish phase
