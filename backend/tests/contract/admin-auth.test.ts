import request from 'supertest'
import type { Express } from 'express'
import { promises as fs } from 'fs'
import path from 'path'

const getDataPath = (fileName: string) =>
  path.join(process.env.DATA_DIR ?? '', fileName)

const removeFileIfExists = async (filePath: string) => {
  try {
    await fs.rm(filePath)
  } catch {
    // ignore
  }
}

describe('Admin auth contract', () => {
  let app: Express

  beforeAll(async () => {
    const { createApp } = await import('../../src/app')
    app = await createApp()
  })

  beforeEach(async () => {
    await removeFileIfExists(getDataPath('admin_users.csv'))
  })

  it('creates the first admin account', async () => {
    const response = await request(app)
      .post('/api/admin/setup')
      .send({ userId: 'admin', password: 'password123' })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Admin created')
  })

  it('rejects setup when admin exists', async () => {
    await request(app)
      .post('/api/admin/setup')
      .send({ userId: 'admin', password: 'password123' })

    const response = await request(app)
      .post('/api/admin/setup')
      .send({ userId: 'admin', password: 'password123' })

    expect(response.status).toBe(409)
  })

  it('allows login and logout', async () => {
    await request(app)
      .post('/api/admin/setup')
      .send({ userId: 'admin', password: 'password123' })

    const loginResponse = await request(app)
      .post('/api/admin/login')
      .send({ userId: 'admin', password: 'password123' })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.headers['set-cookie']).toBeDefined()

    const logoutResponse = await request(app).post('/api/admin/logout')
    expect(logoutResponse.status).toBe(204)
  })
})
