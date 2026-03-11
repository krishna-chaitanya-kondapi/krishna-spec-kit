# Contract: Admin Enriched Response Review

## Overview

These endpoints provide access to the admin detailed view and review actions for enriched responses.

## GET /api/admin/enriched-responses/{id}

### Response 200

```json
{
  "id": "resp_123",
  "originalText": "Original response text",
  "enrichedText": "Enriched response text",
  "enrichmentContext": "Context notes or metadata",
  "currentReviewStatus": "Pending",
  "reviewHistory": [
    {
      "id": "rev_001",
      "status": "Pending",
      "note": null,
      "decidedByAdminId": "admin_42",
      "decidedAt": "2026-03-04T10:12:00Z"
    }
  ]
}
```

### Error Responses

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

## POST /api/admin/enriched-responses/{id}/reviews

### Request

```json
{
  "status": "Approved",
  "note": "Clear improvement, no issues."
}
```

### Response 201

```json
{
  "id": "rev_002",
  "enrichedResponseId": "resp_123",
  "status": "Approved",
  "note": "Clear improvement, no issues.",
  "decidedByAdminId": "admin_42",
  "decidedAt": "2026-03-04T10:15:00Z"
}
```

### Error Responses

- 400 Bad Request (validation failure)
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict (response already reviewed by another admin)
