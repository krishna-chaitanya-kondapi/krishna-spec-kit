# Quickstart: Trifit Janakul Health Challenge Feedback Survey

## Prerequisites

- Node.js 20 LTS
- npm 10+

## Setup

```bash
# from repository root
cd frontend
npm install

cd ../backend
npm install
```

## Configure CSV Storage

- Ensure `data/` exists at the repository root.
- The API writes `data/submissions.csv` on successful submissions.

## Run Development Servers

```bash
# frontend (Vite)
cd frontend
npm run dev

# backend (Express)
cd ../backend
npm run dev
```

## Verify

- Open the frontend URL shown by Vite.
- Submit a sample survey and verify the response is recorded in
  `data/submissions.csv`.
- Check the API health endpoint:

```bash
curl http://localhost:3000/api/health
```

## Validation Notes

- Submit once with missing required ratings to verify the error summary and
  field-level messages.
- Submit a fully completed survey and confirm a new row appears in
  `data/submissions.csv` with expected columns.
- Confirm the review step matches the final submission payload.
