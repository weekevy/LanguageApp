import {
  AudioLines,
  Crown,
  CircleHelp,
  Home,
  Mic2,
  PenLine,
  Settings,
  Waves,
  type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
  label: string
  path: string
  icon: LucideIcon
}

export const navigationItems: NavigationItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Speaking', path: '/speaking', icon: Mic2 },
  { label: 'Writing', path: '/writing', icon: PenLine },
  { label: 'Shadowing', path: '/shadowing', icon: Waves },
  { label: 'Pronunciation', path: '/pronunciation', icon: AudioLines },
  { label: 'Upgrade', path: '/pricing', icon: Crown },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'Help', path: '/help', icon: CircleHelp },
]

export const mobileNavigationItems: NavigationItem[] = [
  navigationItems[0]!,
  navigationItems[1]!,
  navigationItems[3]!,
  { label: 'Upgrade', path: '/pricing', icon: Crown },
  navigationItems[6]!,
]
