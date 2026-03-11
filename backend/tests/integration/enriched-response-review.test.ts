import request from 'supertest'
import type { Express } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { initCsvStorage } from '../../src/services/csv-init'
import { readCsv } from '../../src/storage/csvStore'

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

const getDataPath = (fileName: string) =>
  path.join(process.env.DATA_DIR ?? '', fileName)

const removeFileIfExists = async (filePath: string) => {
  try {
    await fs.rm(filePath)
  } catch {
    // ignore
  }
}

describe('Enriched response review integration', () => {
  let app: Express

  beforeAll(async () => {
    const { createApp } = await import('../../src/app')
    app = await createApp()
  })

  beforeEach(async () => {
    await removeFileIfExists(getDataPath('admin_users.csv'))
    await removeFileIfExists(getDataPath('submissions.csv'))
    await removeFileIfExists(getDataPath('enriched_responses.csv'))
    await removeFileIfExists(getDataPath('review_decisions.csv'))
    await initCsvStorage(process.env.DATA_DIR ?? '')
  })

  it('persists review decisions to CSV storage', async () => {
    const agent = request.agent(app)

    await agent
      .post('/api/admin/setup')
      .send({ userId: 'admin', password: 'password123' })

    await agent
      .post('/api/admin/login')
      .send({ userId: 'admin', password: 'password123' })

    const feedbackResponse = await agent.post('/api/feedback').send(validPayload)
    const submissionId = feedbackResponse.body.submissionId

    const response = await agent
      .post(`/api/admin/enriched-responses/${submissionId}/reviews`)
      .send({ status: 'Approved', note: 'Looks good.' })

    expect(response.status).toBe(201)

    const { rows } = await readCsv(getDataPath('review_decisions.csv'))
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      enriched_response_id: submissionId,
      status: 'Approved',
      note: 'Looks good.',
    })
  })
})
