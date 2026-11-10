import { create } from 'zustand'

export type AuthMode = 'login' | 'register'

interface UiState {
  isAuthOpen: boolean
  authMode: AuthMode
  isMobileMenuOpen: boolean
  isSidebarCollapsed: boolean
  openAuth: (mode?: AuthMode) => void
  closeAuth: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isAuthOpen: false,
  authMode: 'login',
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  openAuth: (authMode = 'login') => set({ isAuthOpen: true, authMode }),
  closeAuth: () => set({ isAuthOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
