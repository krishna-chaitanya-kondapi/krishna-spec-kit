import request from 'supertest'
import type { Express } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { initCsvStorage } from '../../src/services/csv-init'

const payloadA = {
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

const payloadB = {
  ...payloadA,
  category: 'Seniors',
  overallComment: 'Solid event',
}

const getDataPath = (fileName: string) =>
  path.join(process.env.DATA_DIR ?? '', fileName)

const removeFileIfExists = async (filePath: string) => {
  try {
    await fs.rm(filePath)
  } catch {
    // ignore
  }
}

describe('Response list pagination integration', () => {
  let app: Express

  beforeAll(async () => {
    const { createApp } = await import('../../src/app')
    app = await createApp()
  })

  beforeEach(async () => {
    await removeFileIfExists(getDataPath('admin_users.csv'))
    await removeFileIfExists(getDataPath('submissions.csv'))
    await initCsvStorage(process.env.DATA_DIR ?? '')
  })

  it('paginates response list for admin', async () => {
    const agent = request.agent(app)

    await agent
      .post('/api/admin/setup')
      .send({ userId: 'admin', password: 'password123' })

    await agent
      .post('/api/admin/login')
      .send({ userId: 'admin', password: 'password123' })

    await agent.post('/api/feedback').send(payloadA)
    await agent.post('/api/feedback').send(payloadB)

    const response = await agent.get(
      '/api/collections/feedback-survey/responses?limit=1&offset=0',
    )

    expect(response.status).toBe(200)
    expect(response.body.items).toHaveLength(1)
  })
})
