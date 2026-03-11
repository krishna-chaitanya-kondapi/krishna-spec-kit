# Data Model: Trifit Janakul Health Challenge Feedback Survey

## Entities

### ParticipantFeedback

- **Fields**
  - `submission_id` (string, UUID)
  - `category` (enum: Juniors, Seniors, Adult Males, Adult Females)
  - `section_responses` (array of SectionResponse, required)
  - `overall_comment` (string, optional, max 1000 chars)
  - `submitted_at` (ISO 8601 timestamp)
  - `schema_version` (string, e.g., "1.0")

- **Validation Rules**
  - `category` must be one of the allowed enums.
  - `section_responses` must include all three sections.
  - `overall_comment` is optional and trimmed; reject >1000 chars.

### SectionResponse

- **Fields**
  - `section_name` (enum: Flexibility, Strength, Endurance)
  - `activity_ratings` (array of ActivityRating, required)
  - `section_comment` (string, optional, max 1000 chars)

- **Validation Rules**
  - `activity_ratings` must include required activities per section:
    - Flexibility: Suryanamaskarams
    - Strength: Pushups, Plank, Squats
    - Endurance: 3K Running
  - `section_comment` is optional and trimmed; reject >1000 chars.

### ActivityRating

- **Fields**
  - `activity_name` (enum by section)
  - `rating` (integer, 1-5)

- **Validation Rules**
  - `rating` must be an integer between 1 and 5.

## Relationships

- ParticipantFeedback **1..*** SectionResponse
- SectionResponse **1..*** ActivityRating

## State Transitions

- Draft -> Reviewed -> Submitted
- Submitted is terminal; no edits after submission.

## CSV Representation (Conceptual)

Each submission is stored as a single row with flattened columns, including
`schema_version`, `submission_id`, `category`, `submitted_at`, activity ratings,
section comments, and `overall_comment`. Column names remain stable for
backward compatibility.
