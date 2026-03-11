import fs from 'fs'
import path from 'path'
import request from 'supertest'
import type { Express } from 'express'

const validPayload = {
  category: 'Seniors',
  sectionResponses: [
    {
      sectionName: 'Flexibility',
      activityRatings: [{ activityName: 'Suryanamaskarams', rating: 4 }],
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
}

describe('CSV persistence', () => {
  let app: Express
  let csvPath: string

  beforeAll(async () => {
    const dataDir = process.env.DATA_DIR as string
    csvPath = path.join(dataDir, 'submissions.csv')
    const { createApp } = await import('../../src/app')
    app = await createApp()
  })

  it('appends a row after submission', async () => {
    await request(app).post('/api/feedback').send(validPayload).expect(201)

    const content = fs.readFileSync(csvPath, 'utf-8').trim()
    const lines = content.split('\n')

    expect(lines.length).toBeGreaterThan(1)
  })
})
