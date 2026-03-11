# Data Model: Admin Review Responses

## Entities

### AdminUser

- Represents: An administrator who can review responses.
- Fields:
  - id (uuid)
  - userId (string, unique)
  - passwordHash (string)
  - createdAt (iso-8601 datetime)
  - lastLoginAt (iso-8601 datetime, nullable)

### Participant

- Represents: A person who submitted a response.
- Fields:
  - id (uuid)
  - displayName (string)
  - externalRef (string, optional)
  - createdAt (iso-8601 datetime)

### Collection

- Represents: A survey or session that collects responses.
- Fields:
  - id (uuid)
  - name (string)
  - createdAt (iso-8601 datetime)

### Response

- Represents: A submitted response by a participant for a collection.
- Fields:
  - id (uuid)
  - collectionId (uuid)
  - participantId (uuid)
  - submittedAt (iso-8601 datetime)
  - answersJson (string, JSON payload)
  - status (string, fixed to "submitted")

## Relationships

- Participant 1..* Response
- Collection 1..* Response
- Response belongs to exactly one Participant and one Collection

## Validation Rules

- AdminUser.userId must be unique and 3-64 characters.
- AdminUser password must be at least 8 characters before hashing.
- Response.submittedAt is required and must be a valid datetime.
- Response.answersJson must be valid JSON (object or array).
- Response.collectionId and Response.participantId must refer to existing records.

## State Transitions

- Response status is "submitted" only; no transitions in current scope.

## CSV Storage (proposed headers)

- admin_users.csv: id,userId,passwordHash,createdAt,lastLoginAt
- participants.csv: id,displayName,externalRef,createdAt
- collections.csv: id,name,createdAt
- responses.csv: id,collectionId,participantId,submittedAt,answersJson,status
