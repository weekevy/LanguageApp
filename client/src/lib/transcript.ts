import type { TranscriptLine } from '@linguatube/shared'

export const findActiveLineIndex = (
  lines: TranscriptLine[],
  currentTime: number,
) => {
  let low = 0
  let high = lines.length - 1

  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    const line = lines[middle]

    if (!line) break
    if (currentTime < line.start) {
      high = middle - 1
    } else if (
      currentTime > line.end ||
      (currentTime === line.end && middle !== lines.length - 1)
    ) {
      low = middle + 1
    } else {
      return middle
    }
  }

  return -1
}

export const canViewTranslation = (
  lineIndex: number,
  plan: 'free' | 'pro',
  unlockedFreeLines = 5,
) => plan === 'pro' || lineIndex < unlockedFreeLines
