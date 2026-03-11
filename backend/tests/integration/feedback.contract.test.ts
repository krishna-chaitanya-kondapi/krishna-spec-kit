import request from 'supertest'
import type { Express } from 'express'

const validPayload = {
  category: 'Juniors',
  sectionResponses: [
    {
      sectionName: 'Flexibility',
      activityRatings: [{ activityName: 'Suryanamaskarams', rating: 4 }],
      sectionComment: 'Good pacing',
    },
    {
      sectionName: 'Strength',
      activityRatings: [
        { activityName: 'Pushups', rating: 5 },
        { activityName: 'Plank', rating: 4 },
        { activityName: 'Squats', rating: 5 },
      ],
    },
    {
      sectionName: 'Endurance',
      activityRatings: [{ activityName: '3K Running', rating: 3 }],
    },
  ],
  overallComment: 'Great event',
}

describe('POST /api/feedback', () => {
  let app: Express

  beforeAll(async () => {
    const { createApp } = await import('../../src/app')
    app = await createApp()
  })

  it('returns 201 with submission metadata for valid payload', async () => {
    const response = await request(app).post('/api/feedback').send(validPayload)

    expect(response.status).toBe(201)
    expect(response.body.submissionId).toBeDefined()
    expect(response.body.submittedAt).toBeDefined()
    expect(response.body.message).toBe('Feedback recorded')
  })
})
