import { promises as fs } from 'fs'
import path from 'path'

const CSV_HEADER = [
  'schema_version',
  'submission_id',
  'category',
  'submitted_at',
  'flexibility_suryanamaskarams_rating',
  'flexibility_comment',
  'strength_pushups_rating',
  'strength_plank_rating',
  'strength_squats_rating',
  'strength_comment',
  'endurance_3k_running_rating',
  'endurance_comment',
  'overall_comment',
].join(',')

const ADMIN_USERS_HEADER = [
  'id',
  'userId',
  'passwordHash',
  'createdAt',
  'lastLoginAt',
].join(',')

const ENRICHED_RESPONSES_HEADER = [
  'id',
  'original_text',
  'enriched_text',
  'enrichment_context',
  'current_review_status',
  'created_at',
  'updated_at',
].join(',')

const REVIEW_DECISIONS_HEADER = [
  'id',
  'enriched_response_id',
  'status',
  'note',
  'decided_by_admin_id',
  'decided_at',
].join(',')

export const initCsvStorage = async (dataDir: string) => {
  await fs.mkdir(dataDir, { recursive: true })
  const csvPath = path.join(dataDir, 'submissions.csv')
  const adminUsersPath = path.join(dataDir, 'admin_users.csv')
  const enrichedResponsesPath = path.join(dataDir, 'enriched_responses.csv')
  const reviewDecisionsPath = path.join(dataDir, 'review_decisions.csv')

  try {
    await fs.access(csvPath)
  } catch {
    await fs.writeFile(csvPath, `${CSV_HEADER}\n`, 'utf-8')
  }

  try {
    await fs.access(adminUsersPath)
  } catch {
    await fs.writeFile(adminUsersPath, `${ADMIN_USERS_HEADER}\n`, 'utf-8')
  }

  try {
    await fs.access(enrichedResponsesPath)
  } catch {
    await fs.writeFile(
      enrichedResponsesPath,
      `${ENRICHED_RESPONSES_HEADER}\n`,
      'utf-8',
    )
  }

  try {
    await fs.access(reviewDecisionsPath)
  } catch {
    await fs.writeFile(
      reviewDecisionsPath,
      `${REVIEW_DECISIONS_HEADER}\n`,
      'utf-8',
    )
  }

  return csvPath
}
