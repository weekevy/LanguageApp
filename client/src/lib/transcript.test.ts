import type { TranscriptLine } from '@linguatube/shared'
import { describe, expect, it } from 'vitest'
import { canViewTranslation, findActiveLineIndex } from './transcript'

const lines: TranscriptLine[] = [
  { id: '1', start: 0, end: 3, text: 'One', language: 'en', isTranslated: false },
  { id: '2', start: 3, end: 7, text: 'Two', language: 'en', isTranslated: false },
  { id: '3', start: 8, end: 10, text: 'Three', language: 'en', isTranslated: false },
]

describe('findActiveLineIndex', () => {
  it('finds active lines with a binary lookup', () => {
    expect(findActiveLineIndex(lines, 0)).toBe(0)
    expect(findActiveLineIndex(lines, 4.5)).toBe(1)
    expect(findActiveLineIndex(lines, 9.9)).toBe(2)
  })

  it('returns -1 for gaps and out-of-range timestamps', () => {
    expect(findActiveLineIndex(lines, 7.5)).toBe(-1)
    expect(findActiveLineIndex(lines, 11)).toBe(-1)
  })
})

describe('translation access', () => {
  it('unlocks only the first five lines for free users', () => {
    expect(canViewTranslation(0, 'free')).toBe(true)
    expect(canViewTranslation(4, 'free')).toBe(true)
    expect(canViewTranslation(5, 'free')).toBe(false)
  })

  it('unlocks every line for pro users', () => {
    expect(canViewTranslation(999, 'pro')).toBe(true)
  })
})
