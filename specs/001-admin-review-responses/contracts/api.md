# API Contracts: Admin Review Responses

Base URL: `/api`

## Authentication

- Admin-only endpoints require a valid session cookie.
- Session cookie is HTTP-only and set on login.

## Endpoints

### POST /api/admin/setup

Creates the first Admin account if none exists.

Request:
```json
{
  "userId": "admin",
  "password": "string"
}
```

Responses:
- 201 Created (admin created)
- 409 Conflict (admin already exists)

### POST /api/admin/login

Authenticates an Admin and issues a session cookie.

Request:
```json
{
  "userId": "admin",
  "password": "string"
}
```

Responses:
- 200 OK
- 401 Unauthorized

### POST /api/admin/logout

Clears the session cookie.

Responses:
- 204 No Content

### GET /api/collections/{collectionId}/responses

Returns a paginated list of response summaries for a collection.

Query params:
- `limit` (default 50, max 200)
- `offset` (default 0)

Response:
```json
{
  "items": [
    {
      "id": "uuid",
      "participantId": "uuid",
      "participantDisplayName": "string",
      "submittedAt": "2026-03-03T12:00:00Z",
      "preview": "string"
    }
  ],
  "total": 123
}
```

### GET /api/responses/{responseId}

Returns full response details.

Response:
```json
{
  "id": "uuid",
  "collectionId": "uuid",
  "participantId": "uuid",
  "participantDisplayName": "string",
  "submittedAt": "2026-03-03T12:00:00Z",
  "answers": {
    "question1": "value"
  }
}
```

## Errors

All error responses:
```json
{
  "error": "string",
  "message": "string"
}
```
