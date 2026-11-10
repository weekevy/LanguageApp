import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useVideoStore } from './videoStore'

describe('videoStore playback updates', () => {
  beforeEach(() => {
    useVideoStore.setState({
      currentTime: 0,
      duration: 120,
      isPlaying: false,
    })
  })

  it('does not publish duplicate playback values', () => {
    const listener = vi.fn()
    const unsubscribe = useVideoStore.subscribe(listener)

    useVideoStore.getState().setPlayback(0.01, 120)
    expect(listener).not.toHaveBeenCalled()

    useVideoStore.getState().setPlayback(0.2, 120)
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
  })

  it('does not publish an unchanged playing state', () => {
    const listener = vi.fn()
    const unsubscribe = useVideoStore.subscribe(listener)

    useVideoStore.getState().setIsPlaying(false)
    expect(listener).not.toHaveBeenCalled()

    useVideoStore.getState().setIsPlaying(true)
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
  })
})
