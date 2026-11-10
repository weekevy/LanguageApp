import type { CapacitorConfig } from '@capacitor/cli'

/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />
/// <reference types="@capawesome/capacitor-navigation-bar" />

const liveReload = process.env.CAPACITOR_LIVE_RELOAD === 'true'

const config: CapacitorConfig = {
  appId: 'com.linguatube.app',
  appName: 'LinguaTube',
  webDir: 'dist',
  android: {
    allowMixedContent: liveReload,
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#0b0b12',
      style: 'LIGHT',
    },
    EdgeToEdge: {
      backgroundColor: '#0b0b12',
      statusBarColor: '#0b0b12',
      navigationBarColor: '#0b0b12',
    },
    NavigationBar: {
      color: '#0b0b12',
      dividerColor: 'transparent',
      style: 'DARK',
    },
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
