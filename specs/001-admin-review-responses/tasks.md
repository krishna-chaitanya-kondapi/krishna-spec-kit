# Tasks: Admin Review Responses

**Input**: Design documents from `/specs/001-admin-review-responses/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for critical paths per the constitution and are included below.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend scaffold in backend/package.json, backend/tsconfig.json, backend/src/index.ts
- [x] T002 Create frontend scaffold in frontend/package.json, frontend/tsconfig.json, frontend/vite.config.ts, frontend/src/main.tsx, frontend/index.html
- [x] T003 [P] Create backend environment template in backend/.env.example
- [x] T004 [P] Create frontend environment template in frontend/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Add backend configuration loader in backend/src/config.ts
- [x] T006 [P] Implement CSV read/write utility in backend/src/storage/csvStore.ts
- [x] T007 [P] Add error handling middleware in backend/src/middleware/errorHandler.ts
- [x] T008 [P] Add admin auth guard middleware in backend/src/middleware/requireAdmin.ts
- [x] T009 Create admin session service in backend/src/services/adminSessionService.ts
- [x] T010 [P] Define AdminUser model in backend/src/models/adminUser.ts
- [x] T011 [P] Define Participant model in backend/src/models/participant.ts
- [x] T012 [P] Define Collection model in backend/src/models/collection.ts
- [x] T013 [P] Define Response model in backend/src/models/response.ts
- [x] T014 Create API router skeleton in backend/src/api/index.ts and mount in backend/src/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Review Submitted Responses (Priority: P1) 🎯 MVP

**Goal**: Admin can set up and log in, then review submitted responses with list, preview, and full details.

**Independent Test**: Submit sample responses and verify an Admin can log in, view the list, open preview, and open full details; verify empty state when no responses exist.

### Tests for User Story 1 (REQUIRED for critical paths) ⚠️

- [x] T015 [P] [US1] Contract tests for admin setup/login/logout in backend/tests/contract/admin-auth.test.ts
- [x] T016 [P] [US1] Contract test for response list endpoint in backend/tests/contract/response-list.test.ts
- [x] T017 [P] [US1] Contract test for response detail endpoint in backend/tests/contract/response-detail.test.ts
- [x] T018 [P] [US1] Integration test for CSV-backed review flow in backend/tests/integration/response-review.test.ts
- [x] T019 [P] [US1] UI test for admin setup/login and review flow in frontend/tests/response-review.test.tsx

### Implementation for User Story 1

- [x] T020 [US1] Implement admin setup/login/logout routes in backend/src/api/adminRoutes.ts
- [x] T021 [US1] Implement admin auth service in backend/src/services/adminAuthService.ts
- [x] T022 [US1] Implement admin user CSV store in backend/src/storage/adminUserStore.ts
- [x] T023 [US1] Implement response list service in backend/src/services/responseListService.ts
- [x] T024 [US1] Implement response detail service in backend/src/services/responseDetailService.ts
- [x] T025 [US1] Implement response CSV store in backend/src/storage/responseStore.ts
- [x] T026 [US1] Add response routes in backend/src/api/responseRoutes.ts
- [x] T027 [US1] Wire admin and response routes in backend/src/api/index.ts
- [x] T028 [US1] Create admin setup page in frontend/src/pages/AdminSetupPage.tsx
- [x] T029 [US1] Create admin login page in frontend/src/pages/AdminLoginPage.tsx
- [x] T030 [US1] Create response review page in frontend/src/pages/ResponseReviewPage.tsx
- [x] T031 [US1] Add response preview panel in frontend/src/components/ResponsePreviewPanel.tsx
- [x] T032 [US1] Add response detail view in frontend/src/components/ResponseDetailView.tsx
- [x] T033 [US1] Add API client for admin auth and responses in frontend/src/services/apiClient.ts
- [x] T034 [US1] Add admin routes and auth guard in frontend/src/routes/adminRoutes.tsx
- [x] T035 [US1] Add empty state and error handling in frontend/src/pages/ResponseReviewPage.tsx

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Review at Scale (Priority: P2)

**Goal**: Admin can review large response sets with clear identifiers and pagination.

**Independent Test**: Load a collection with 1,000 responses and verify the list paginates, remains responsive, and shows participant and timestamp data clearly.

### Tests for User Story 2 (REQUIRED for critical paths) ⚠️

- [x] T036 [P] [US2] Contract test for list pagination params in backend/tests/contract/response-list-pagination.test.ts
- [x] T037 [P] [US2] Integration test for paginated list in backend/tests/integration/response-list-pagination.test.ts
- [x] T038 [P] [US2] UI test for paging controls in frontend/tests/response-list-pagination.test.tsx

### Implementation for User Story 2

- [x] T039 [US2] Add pagination to response list service in backend/src/services/responseListService.ts
- [x] T040 [US2] Validate paging params in backend/src/api/responseRoutes.ts
- [x] T041 [US2] Add paging controls in frontend/src/pages/ResponseReviewPage.tsx
- [x] T042 [P] [US2] Add response list item component in frontend/src/components/ResponseListItem.tsx
- [x] T043 [US2] Add loading states for list paging in frontend/src/pages/ResponseReviewPage.tsx

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 [P] Add keyboard navigation and focus styles in frontend/src/pages/ResponseReviewPage.tsx
- [x] T045 [P] Add ARIA labeling and focus management in frontend/src/components/ResponsePreviewPanel.tsx
- [x] T046 [P] Implement login rate limiting in backend/src/middleware/rateLimit.ts
- [x] T047 Wire rate limiting in backend/src/index.ts
- [x] T048 Validate quickstart steps and update if needed in specs/001-admin-review-responses/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - uses response list foundation from US1 but remains independently testable

### Parallel Opportunities

- Setup tasks T003 and T004 can run in parallel
- Foundational tasks T005-T013 can run in parallel by file
- US1 tests T015-T019 can run in parallel
- US1 UI tasks T028-T033 can run in parallel by file
- US2 tests T036-T038 can run in parallel
- US2 UI tasks T041 and T042 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Contract tests for admin setup/login/logout in backend/tests/contract/admin-auth.test.ts"
Task: "Contract test for response list endpoint in backend/tests/contract/response-list.test.ts"
Task: "Contract test for response detail endpoint in backend/tests/contract/response-detail.test.ts"
Task: "Integration test for CSV-backed review flow in backend/tests/integration/response-review.test.ts"
Task: "UI test for admin setup/login and review flow in frontend/tests/response-review.test.tsx"

# Launch UI components for User Story 1 together:
Task: "Add response preview panel in frontend/src/components/ResponsePreviewPanel.tsx"
Task: "Add response detail view in frontend/src/components/ResponseDetailView.tsx"
Task: "Add API client for admin auth and responses in frontend/src/services/apiClient.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Contract test for list pagination params in backend/tests/contract/response-list-pagination.test.ts"
Task: "Integration test for paginated list in backend/tests/integration/response-list-pagination.test.ts"
Task: "UI test for paging controls in frontend/tests/response-list-pagination.test.tsx"

# Launch UI changes for User Story 2 together:
Task: "Add paging controls in frontend/src/pages/ResponseReviewPage.tsx"
Task: "Add response list item component in frontend/src/components/ResponseListItem.tsx"
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
2. Add User Story 1 → Test independently → Deploy/Demo (MVP)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories
