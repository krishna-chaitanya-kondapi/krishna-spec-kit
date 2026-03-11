import { promises as fs } from 'fs'
import path from 'path'
import { initCsvStorage } from '../../src/services/csv-init'
import { upsertEnrichedResponse } from '../../src/storage/enrichedResponseStore'
import { appendReviewDecision } from '../../src/storage/reviewDecisionStore'
import { getEnrichedResponseDetail } from '../../src/services/enrichedResponseService'

const getDataPath = (fileName: string) =>
  path.join(process.env.DATA_DIR ?? '', fileName)

const removeFileIfExists = async (filePath: string) => {
  try {
    await fs.rm(filePath)
  } catch {
    // ignore
  }
}

describe('Review history ordering', () => {
  beforeEach(async () => {
    await removeFileIfExists(getDataPath('enriched_responses.csv'))
    await removeFileIfExists(getDataPath('review_decisions.csv'))
    await initCsvStorage(process.env.DATA_DIR ?? '')
  })

  it('returns review history sorted by decidedAt', async () => {
    await upsertEnrichedResponse({
      id: 'resp-1',
      originalText: 'Original response',
      enrichedText: 'Enriched response',
      enrichmentContext: 'Context',
      currentReviewStatus: 'Pending',
      createdAt: '2026-03-04T10:00:00Z',
      updatedAt: '2026-03-04T10:00:00Z',
    })

    await appendReviewDecision({
      id: 'rev-2',
      enrichedResponseId: 'resp-1',
      status: 'Approved',
      note: null,
      decidedByAdminId: 'admin',
      decidedAt: '2026-03-04T10:15:00Z',
    })

    await appendReviewDecision({
      id: 'rev-1',
      enrichedResponseId: 'resp-1',
      status: 'Pending',
      note: null,
      decidedByAdminId: 'admin',
      decidedAt: '2026-03-04T10:10:00Z',
    })

    const detail = await getEnrichedResponseDetail('resp-1')

    expect(detail).not.toBeNull()
    expect(detail?.reviewHistory.map((item) => item.decidedAt)).toEqual([
      '2026-03-04T10:10:00Z',
      '2026-03-04T10:15:00Z',
    ])
  })
})
