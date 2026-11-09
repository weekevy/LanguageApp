import type { UsageLimits } from '@linguatube/shared'
import { create } from 'zustand'
import { api } from '../lib/api'

interface SubscriptionState {
  limits: UsageLimits | null
  isUpgradeOpen: boolean
  isLoadingLimits: boolean
  setLimits: (limits: UsageLimits) => void
  refreshLimits: () => Promise<void>
  openUpgrade: () => void
  closeUpgrade: () => void
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  limits: null,
  isUpgradeOpen: false,
  isLoadingLimits: false,
  setLimits: (limits) => set({ limits }),
  refreshLimits: async () => {
    set({ isLoadingLimits: true })
    try {
      const limits = await api.limits()
      set({ limits })
    } finally {
      set({ isLoadingLimits: false })
    }
  },
  openUpgrade: () => set({ isUpgradeOpen: true }),
  closeUpgrade: () => set({ isUpgradeOpen: false }),
}))
