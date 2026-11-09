import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const ok = (data: unknown) =>
  new Response(JSON.stringify({ success: true, data, error: null }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

const demoSession = {
  metadata: {
    videoId: 'jNQXAC9IVRw',
    title: 'Me at the zoo — a 19-second listening lesson',
    channel: 'jawed',
    thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/hqdefault.jpg',
    language: 'en',
    difficulty: 'Beginner',
    duration: 19,
  },
  transcript: {
    videoId: 'jNQXAC9IVRw',
    language: 'en',
    isMock: true,
    notice: 'Curated demo: this hand-timed transcript is synchronized.',
    lines: [
      {
        id: 'line-1',
        start: 0,
        end: 19,
        text: 'All right, so here we are in front of the elephants.',
        language: 'en',
        translatedText: 'Alors, nous voici devant les éléphants.',
        isTranslated: true,
      },
    ],
  },
}

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.replaceChildren()
  })

  it('renders the responsive application shell and home page', async () => {
    await import('./pages/HomePage')

    vi.stubGlobal(
      'fetch',
      vi.fn((request: RequestInfo | URL) => {
        const url = String(request)
        if (url.endsWith('/demo')) return Promise.resolve(ok(demoSession))
        if (url.includes('/suggestions'))
          return Promise.resolve(ok({ videos: [] }))
        if (url.includes('/user/limits')) {
          return Promise.resolve(
            ok({
              plan: 'free',
              used: 0,
              limit: 3,
              remaining: 3,
              resetsAt: '2026-11-10T00:00:00.000Z',
            }),
          )
        }
        return Promise.resolve(ok({}))
      }),
    )

    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)

    await act(async () => {
      root.render(
        <MemoryRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <App />
        </MemoryRouter>,
      )
    })

    await vi.waitFor(
      async () => {
        await act(async () => Promise.resolve())
        expect(container.textContent).toContain('Learning studio')
        expect(container.textContent).toContain('Load')
        expect(container.textContent).toContain('Me at the zoo')
      },
      { timeout: 2_000 },
    )

    await act(async () => root.unmount())
  })
})
