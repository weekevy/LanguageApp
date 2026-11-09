import { create } from 'zustand'

interface UiState {
  isAuthOpen: boolean
  isMobileMenuOpen: boolean
  isSidebarCollapsed: boolean
  openAuth: () => void
  closeAuth: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isAuthOpen: false,
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  openAuth: () => set({ isAuthOpen: true }),
  closeAuth: () => set({ isAuthOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}))
