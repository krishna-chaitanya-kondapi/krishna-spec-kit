# Quickstart: Admin Review Responses

## Prerequisites

- Node.js 20 LTS
- npm 9+

## Local Development (planned structure)

1. Start the API:
   - `cd backend`
   - `npm install`
   - `npm run dev`
2. Start the frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Admin Setup and Login

1. Create the first admin:
   - `POST /api/admin/setup` with `userId` and `password`
2. Login:
   - `POST /api/admin/login` and use the returned session cookie

## Review Responses

1. Call `GET /api/collections/{collectionId}/responses` to load the list. Use `limit` and `offset` to paginate.
2. Single click a list item to show the preview panel.
3. Double click a list item or use "Open details" to view full response details via `GET /api/responses/{responseId}`.
