import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app.js'
import { resetUsageForTests } from '../src/services/usageService.js'

describe('LinguaTube API', () => {
  beforeEach(() => resetUsageForTests())

  it('reports provider health', async () => {
    const response = await request(app).get('/api/v1/health').expect(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data.providers).toEqual({
      transcript: 'mock',
      translation: 'mock',
    })
  })

  it('returns a synchronized demo session without consuming usage', async () => {
    const demo = await request(app).get('/api/v1/demo').expect(200)

    expect(demo.body.data.metadata.videoId).toBe('jNQXAC9IVRw')
    expect(demo.body.data.metadata.duration).toBe(19)
    expect(demo.body.data.transcript.lines).toHaveLength(4)
    expect(demo.body.data.transcript.lines[0].words.length).toBeGreaterThan(5)
    expect(demo.body.data.transcript.notice).toContain('synchronized')

    const limits = await request(app)
      .get('/api/v1/user/limits')
      .set('x-device-id', 'demo-usage-test')
      .expect(200)
    expect(limits.body.data.used).toBe(0)
  })

  it('validates and parses a YouTube URL', async () => {
    const response = await request(app)
      .post('/api/v1/video/parse')
      .set('x-device-id', 'api-video-test')
      .send({ url: 'https://youtu.be/M7lc1UVf-VE' })
      .expect(200)

    expect(response.body.data.videoId).toBe('M7lc1UVf-VE')
    expect(response.body.data.limits.used).toBe(1)
  })

  it('returns a clearly marked mock transcript', async () => {
    const response = await request(app)
      .get('/api/v1/transcript/M7lc1UVf-VE')
      .expect(200)

    expect(response.body.data.isMock).toBe(true)
    expect(response.body.data.lines.length).toBeGreaterThan(10)
    expect(response.body.data.notice).toContain('not extracted')
  })

  it('translates and caches a line in mock mode', async () => {
    const input = {
      text: 'That is why videos can be such a powerful learning tool.',
      sourceLang: 'en',
      targetLang: 'fr',
    }
    const first = await request(app)
      .post('/api/v1/translate')
      .send(input)
      .expect(200)
    const second = await request(app)
      .post('/api/v1/translate')
      .send(input)
      .expect(200)

    expect(first.body.data.isMock).toBe(true)
    expect(first.body.data.translated).toContain('vidéos')
    expect(second.body.data.cached).toBe(true)
  })

  it('validates auth input and returns consistent errors', async () => {
    const invalid = await request(app)
      .post('/api/v1/auth/login')
      .send({ name: 'A', email: 'bad' })
      .expect(400)
    expect(invalid.body).toMatchObject({
      success: false,
      data: null,
      error: { code: 'VALIDATION_ERROR' },
    })

    const valid = await request(app)
      .post('/api/v1/auth/login')
      .send({ name: 'Alex', email: 'alex@example.com' })
      .expect(200)
    expect(valid.body.data.user.plan).toBe('free')
    expect(valid.body.data.authentication).toBe('mock')
  })

  it('supports credentials, registration, and social account flows', async () => {
    const credentials = await request(app)
      .post('/api/v1/auth/credentials')
      .send({ username: 'admin', password: 'admin' })
      .expect(200)
    expect(credentials.body.data.user.name).toBe('Admin')

    const registered = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'New Learner',
        email: 'new-learner@example.com',
        username: 'new_learner',
        password: 'secret123',
        confirmPassword: 'secret123',
      })
      .expect(201)
    expect(registered.body.data.user.email).toBe('new-learner@example.com')

    const social = await request(app)
      .post('/api/v1/auth/social')
      .send({ provider: 'google' })
      .expect(200)
    expect(social.body.data.authentication).toBe('google-mock')
  })

  it('returns 404 in the common API error format', async () => {
    const response = await request(app).get('/api/v1/missing').expect(404)
    expect(response.body.error.code).toBe('NOT_FOUND')
  })
})
