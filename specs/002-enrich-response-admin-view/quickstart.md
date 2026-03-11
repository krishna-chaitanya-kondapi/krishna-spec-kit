# Quickstart: Admin Enrich Response Review Panel

## Prerequisites

- Node.js and npm installed.
- Access to the admin role in the application.

## Run the backend

```bash
cd backend
npm install
npm run dev
```

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

## Manual test flow

1. Open the admin interface in the browser.
2. Navigate to an enriched response detailed view from the admin list.
3. Verify the original response, enriched response, and enrichment context render in a visual layout.
4. Set the review status to Approved or Rejected, optionally add a note, and save.
5. Refresh the page and confirm the decision and audit history persist.

## Test commands

```bash
cd backend
npm test
```

```bash
cd frontend
npm test
```
