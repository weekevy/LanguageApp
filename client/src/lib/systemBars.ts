import {
  NavigationBar,
  Style as NavigationBarStyle,
} from '@capawesome/capacitor-navigation-bar'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style as StatusBarStyle } from '@capacitor/status-bar'
import type { AppTheme } from '../store/settingsStore'

const systemBarThemes: Record<AppTheme, { color: string; isLight: boolean }> = {
  light: { color: '#fafafc', isLight: true },
  dark: { color: '#0b0b12', isLight: false },
  midnight: { color: '#070a18', isLight: false },
  aurora: { color: '#071512', isLight: false },
  rose: { color: '#180a12', isLight: false },
  ocean: { color: '#04151c', isLight: false },
  sunset: { color: '#1c0d0a', isLight: false },
  royal: { color: '#100b24', isLight: false },
  mocha: { color: '#17100d', isLight: false },
}

export const syncNativeSystemBars = async (theme: AppTheme) => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return
  }

  const { color, isLight } = systemBarThemes[theme]

  await Promise.allSettled([
    StatusBar.setOverlaysWebView({ overlay: false }),
    StatusBar.setBackgroundColor({ color }),
    StatusBar.setStyle({
      style: isLight ? StatusBarStyle.Dark : StatusBarStyle.Light,
    }),
    // Keep the WebView inset below Android's status bar and display cutout.
    // Disabling this plugin removes those insets and lets the mobile top bar
    // render underneath the notch on Android 15+.
    EdgeToEdge.enable(),
    EdgeToEdge.setStatusBarColor({ color }),
    EdgeToEdge.setNavigationBarColor({ color }),
    NavigationBar.setColor({ color, dividerColor: 'transparent' }),
    NavigationBar.setStyle({
      style: isLight ? NavigationBarStyle.Light : NavigationBarStyle.Dark,
    }),
  ])
}
