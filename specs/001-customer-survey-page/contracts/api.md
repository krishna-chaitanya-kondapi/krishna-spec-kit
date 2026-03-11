# API Contract: Trifit Janakul Health Challenge Feedback Survey

## Overview

REST API for survey submissions. All responses are JSON. Errors use a consistent
shape.

## Common Error Shape

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      { "field": "category", "issue": "Required" }
    ]
  }
}
```

## POST /api/feedback

Submit participant feedback.

### Request Body

```json
{
  "category": "Juniors",
  "sectionResponses": [
    {
      "sectionName": "Flexibility",
      "activityRatings": [
        { "activityName": "Suryanamaskarams", "rating": 4 }
      ],
      "sectionComment": "Optional comment"
    },
    {
      "sectionName": "Strength",
      "activityRatings": [
        { "activityName": "Pushups", "rating": 5 },
        { "activityName": "Plank", "rating": 4 },
        { "activityName": "Squats", "rating": 5 }
      ]
    },
    {
      "sectionName": "Endurance",
      "activityRatings": [
        { "activityName": "3K Running", "rating": 3 }
      ]
    }
  ],
  "overallComment": "Optional overall comment"
}
```

### Validation Rules

- `category` required; enum: Juniors, Seniors, Adult Males, Adult Females.
- `sectionResponses` required; must include Flexibility, Strength, Endurance.
- `activityRatings` required per section; rating integer 1-5.
- Comments optional; max 1000 chars.

### Responses

- **201 Created**

```json
{
  "submissionId": "uuid",
  "message": "Feedback recorded",
  "submittedAt": "2026-03-03T12:34:56Z"
}
```

- **400 Bad Request**: Validation error (see Common Error Shape).
- **429 Too Many Requests**: Rate limit exceeded.
- **500 Internal Server Error**: Unexpected error with safe message.

## GET /api/health

Basic health check.

### Response

- **200 OK**

```json
{ "status": "ok" }
```
