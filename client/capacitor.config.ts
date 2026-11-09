import type { CapacitorConfig } from '@capacitor/cli'

const liveReload = process.env.CAPACITOR_LIVE_RELOAD === 'true'

const config: CapacitorConfig = {
  appId: 'com.linguatube.app',
  appName: 'LinguaTube',
  webDir: 'dist',
  android: {
    allowMixedContent: liveReload,
  },
  ...(liveReload
    ? {
        server: {
          url: 'http://localhost:5173',
          cleartext: true,
          androidScheme: 'http',
        },
      }
    : {}),
}

export default config
