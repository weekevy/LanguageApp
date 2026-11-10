import { useEffect, useState } from 'react'

export const useCssPresence = (open: boolean, exitDuration = 220) => {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    let secondFrame = 0
    let mountTimeout = 0
    let exitTimeout = 0

    if (open) {
      mountTimeout = window.setTimeout(() => {
        setMounted(true)
        frame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => setVisible(true))
        })
      }, 0)
    } else {
      frame = window.requestAnimationFrame(() => setVisible(false))
      exitTimeout = window.setTimeout(() => setMounted(false), exitDuration)
    }

    return () => {
      window.cancelAnimationFrame(frame)
      window.cancelAnimationFrame(secondFrame)
      window.clearTimeout(mountTimeout)
      window.clearTimeout(exitTimeout)
    }
  }, [exitDuration, open])

  return { mounted, visible }
}
