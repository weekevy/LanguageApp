import { describe, expect, it } from 'vitest'
import { normalizeSubtitles } from '../src/providers/transcript/RealTranscriptProvider.js'

describe('normalizeSubtitles', () => {
  it('preserves caption text and creates ordered word timing', () => {
    const lines = normalizeSubtitles('M7lc1UVf-VE', [
      { start: '1', dur: '3', text: '  Learn   real English. ' },
      { start: '4', dur: '2', text: 'One word at a time.' },
    ])

    expect(lines).toHaveLength(2)
    expect(lines[0]?.text).toBe('Learn real English.')
    expect(lines[0]?.start).toBe(1)
    expect(lines[0]?.end).toBe(4)
    expect(lines[0]?.words?.map((word) => word.text)).toEqual([
      'Learn',
      'real',
      'English.',
    ])
    expect(lines[0]?.words?.[0]?.start).toBe(1)
    expect(lines[0]?.words?.at(-1)?.end).toBe(4)
  })

  it('drops invalid captions and repairs missing durations', () => {
    const lines = normalizeSubtitles('M7lc1UVf-VE', [
      { start: 'bad', dur: '1', text: 'Invalid timing' },
      { start: '2', dur: 'bad', text: 'First valid line' },
      { start: '5', dur: '1', text: 'Second valid line' },
    ])

    expect(lines).toHaveLength(2)
    expect(lines[0]).toMatchObject({ start: 2, end: 5 })
  })
})
