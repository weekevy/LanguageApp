import { describe, expect, it } from 'vitest'
import { parseYouTubeUrl } from './youtube'

describe('parseYouTubeUrl', () => {
  it.each([
    ['https://www.youtube.com/watch?v=M7lc1UVf-VE', 'M7lc1UVf-VE'],
    ['https://youtu.be/M7lc1UVf-VE?t=10', 'M7lc1UVf-VE'],
    ['https://www.youtube.com/embed/M7lc1UVf-VE', 'M7lc1UVf-VE'],
    ['https://youtube.com/shorts/M7lc1UVf-VE', 'M7lc1UVf-VE'],
  ])('extracts an ID from %s', (url, expected) => {
    expect(parseYouTubeUrl(url)).toBe(expected)
  })

  it.each([
    'not a url',
    'https://example.com/watch?v=M7lc1UVf-VE',
    'https://youtube.com/watch?v=short',
    'https://youtube.com/channel/M7lc1UVf-VE',
  ])('rejects unsupported input: %s', (url) => {
    expect(parseYouTubeUrl(url)).toBeNull()
  })
})
