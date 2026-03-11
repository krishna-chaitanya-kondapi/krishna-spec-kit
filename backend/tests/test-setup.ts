import fs from 'fs'
import os from 'os'
import path from 'path'

const workerId = process.env.JEST_WORKER_ID ?? '0'
const dataDir = path.join(os.tmpdir(), `survey-feedback-tests-${workerId}`)

fs.rmSync(dataDir, { recursive: true, force: true })
fs.mkdirSync(dataDir, { recursive: true })

process.env.DATA_DIR = dataDir
process.env.NODE_ENV = 'test'
