---

description: "Task list for Trifit Janakul Health Challenge Feedback Survey"
---

# Tasks: Trifit Janakul Health Challenge Feedback Survey

**Input**: Design documents from `/specs/001-customer-survey-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for critical paths per the constitution and are included below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `frontend/` Vite React + TypeScript app scaffold in frontend/
- [x] T002 Create `backend/` Node.js + Express + TypeScript scaffold in backend/
- [x] T003 [P] Configure frontend linting/formatting in frontend/.eslintrc.cjs and frontend/.prettierrc
- [x] T004 [P] Configure backend linting/formatting in backend/.eslintrc.cjs and backend/.prettierrc
- [x] T005 [P] Add shared root .editorconfig and .gitignore entries for data/submissions.csv

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create backend env config loader in backend/src/config/env.ts
- [x] T007 [P] Add Express app bootstrap and middleware pipeline in backend/src/app.ts
- [x] T008 [P] Add security middleware (helmet, rate limiting, body size limits) in backend/src/middleware/security.ts
- [x] T009 Add centralized error handling in backend/src/middleware/error-handler.ts
- [x] T010 [P] Add request validation helper with Zod in backend/src/validators/feedback-schema.ts
- [x] T011 Create CSV writer service with queued appends in backend/src/services/csv-writer.ts
- [x] T012 [P] Ensure data directory exists and CSV header is initialized in backend/src/services/csv-init.ts
- [x] T013 [P] Add health endpoint in backend/src/api/health.ts
- [x] T014 Wire API routes and middleware in backend/src/api/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Competition Feedback (Priority: P1) 🎯 MVP

**Goal**: Participants can complete required ratings and submit feedback successfully.

**Independent Test**: A participant submits a complete survey and sees confirmation; a CSV row is written.

### Tests for User Story 1 (REQUIRED for critical paths) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T015 [P] [US1] Contract test for POST /api/feedback in backend/tests/integration/feedback.contract.test.ts
- [x] T016 [P] [US1] Integration test for CSV write path in backend/tests/integration/feedback.csv.test.ts
- [x] T017 [P] [US1] Frontend form validation test in frontend/tests/unit/survey-form.validation.test.tsx

### Implementation for User Story 1

- [x] T018 [P] [US1] Define shared survey enums and types in frontend/src/services/survey-types.ts
- [x] T019 [P] [US1] Build survey form layout with fieldsets and legends in frontend/src/pages/SurveyPage.tsx
- [x] T020 [P] [US1] Implement form state and validation schema in frontend/src/services/survey-schema.ts
- [x] T021 [US1] Add submit handler and API client in frontend/src/services/feedback-api.ts
- [x] T022 [P] [US1] Add accessible error summary component in frontend/src/components/ErrorSummary.tsx
- [x] T023 [US1] Add submit success state UI in frontend/src/pages/SurveyPage.tsx
- [x] T024 [P] [US1] Implement POST /api/feedback handler in backend/src/api/feedback.ts
- [x] T025 [US1] Map request to CSV row in backend/src/services/feedback-mapper.ts
- [x] T026 [US1] Return 201 response with submission metadata in backend/src/api/feedback.ts

**Checkpoint**: User Story 1 is fully functional and independently testable

---

## Phase 4: User Story 2 - Review Before Submit (Priority: P2)

**Goal**: Participants can review and edit responses before final submission.

**Independent Test**: A participant views a summary, edits a response, and submits with updated data.

### Tests for User Story 2 (REQUIRED for critical paths) ⚠️

- [x] T027 [P] [US2] Frontend review step test in frontend/tests/integration/survey-review-flow.test.tsx

### Implementation for User Story 2

- [x] T028 [P] [US2] Add review step layout in frontend/src/components/ReviewStep.tsx
- [x] T029 [US2] Add step navigation state and editing flow in frontend/src/pages/SurveyPage.tsx
- [x] T030 [US2] Ensure review summary matches submission payload in frontend/src/services/feedback-api.ts

**Checkpoint**: User Story 2 is independently functional

---

## Phase 5: User Story 3 - Optional Written Feedback (Priority: P3)

**Goal**: Participants can add optional comments for sections and overall feedback.

**Independent Test**: Optional comments appear in review summary and are submitted successfully.

### Tests for User Story 3 (REQUIRED for critical paths) ⚠️

- [x] T031 [P] [US3] Frontend optional comments test in frontend/tests/unit/survey-comments.test.tsx
- [x] T032 [P] [US3] Backend validation test for comment length in backend/tests/unit/feedback-schema.test.ts

### Implementation for User Story 3

- [x] T033 [P] [US3] Add optional comment fields to form UI in frontend/src/pages/SurveyPage.tsx
- [x] T034 [US3] Extend Zod schema to validate comments in frontend/src/services/survey-schema.ts
- [x] T035 [US3] Extend backend validation schema for comments in backend/src/validators/feedback-schema.ts
- [x] T036 [US3] Map optional comments into CSV row in backend/src/services/feedback-mapper.ts

**Checkpoint**: User Story 3 is independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T037 [P] Add performance timing middleware and p95 logging in backend/src/middleware/perf-timing.ts
- [x] T038 [P] Add accessibility checklist notes to frontend/src/pages/SurveyPage.tsx (aria-describedby and focus order)
- [x] T039 [P] Add API error state UI in frontend/src/components/ApiErrorBanner.tsx
- [x] T040 [P] Add quickstart validation notes in specs/001-customer-survey-page/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 form payload structure but remains independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 form payload structure but remains independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Schema/types before UI wiring
- UI flow before API integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks marked [P] can run in parallel
- Foundational tasks marked [P] can run in parallel (within Phase 2)
- Tests for a story marked [P] can run in parallel
- Frontend and backend tasks in the same story can run in parallel if files do not overlap

---

## Parallel Example: User Story 1

```bash
Task: "[US1] Contract test for POST /api/feedback in backend/tests/integration/feedback.contract.test.ts"
Task: "[US1] Integration test for CSV write path in backend/tests/integration/feedback.csv.test.ts"
Task: "[US1] Frontend form validation test in frontend/tests/unit/survey-form.validation.test.tsx"
Task: "[US1] Build survey form layout with fieldsets and legends in frontend/src/pages/SurveyPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently
