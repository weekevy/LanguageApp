import { describe, expect, it } from 'vitest'
import { AppError } from '../src/lib/errors.js'
import { extractYouTubeVideoId } from '../src/services/videoService.js'

describe('extractYouTubeVideoId', () => {
  it.each([
    'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    'https://youtu.be/M7lc1UVf-VE?t=4',
    'https://youtube.com/embed/M7lc1UVf-VE',
    'https://youtube.com/shorts/M7lc1UVf-VE',
    'https://youtube.com/live/M7lc1UVf-VE?feature=share',
    'https://www.youtube-nocookie.com/embed/M7lc1UVf-VE',
  ])('supports %s', (url) => {
    expect(extractYouTubeVideoId(url)).toBe('M7lc1UVf-VE')
  })

  it.each([
    'invalid',
    'https://example.com/watch?v=M7lc1UVf-VE',
    'https://youtube.com/watch?v=bad',
  ])('rejects %s', (url) => {
    expect(() => extractYouTubeVideoId(url)).toThrow(AppError)
  })
})
