let apiPromise: Promise<typeof YT> | null = null

export const loadYouTubeApi = (): Promise<typeof YT> => {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      if (window.YT) resolve(window.YT)
      else reject(new Error('YouTube player API did not initialize.'))
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    )

    if (existingScript) {
      existingScript.addEventListener('error', () =>
        reject(new Error('Could not load the YouTube player API.')),
      )
      return
    }

    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.addEventListener('error', () =>
      reject(new Error('Could not load the YouTube player API.')),
    )
    document.head.append(script)
  })

  return apiPromise
}
