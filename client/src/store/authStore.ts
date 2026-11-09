import type { MockUser, SubscriptionPlan } from '@linguatube/shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

interface AuthState {
  user: MockUser | null
  isAuthenticating: boolean
  login: (username: string, password: string) => Promise<MockUser>
  register: (input: {
    name: string
    email: string
    username: string
    password: string
    confirmPassword: string
  }) => Promise<MockUser>
  socialLogin: (provider: 'google' | 'x') => Promise<MockUser>
  logout: () => void
  setPlan: (plan: SubscriptionPlan) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticating: false,
      login: async (username, password) => {
        set({ isAuthenticating: true })
        try {
          const { user } = await api.loginWithCredentials(username, password)
          set({ user })
          return user
        } finally {
          set({ isAuthenticating: false })
        }
      },
      register: async (input) => {
        set({ isAuthenticating: true })
        try {
          const { user } = await api.register(input)
          set({ user })
          return user
        } finally {
          set({ isAuthenticating: false })
        }
      },
      socialLogin: async (provider) => {
        set({ isAuthenticating: true })
        try {
          const { user } = await api.socialLogin(provider)
          set({ user })
          return user
        } finally {
          set({ isAuthenticating: false })
        }
      },
      logout: () => set({ user: null }),
      setPlan: (plan) =>
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null,
        })),
    }),
    {
      name: 'linguatube-auth',
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
