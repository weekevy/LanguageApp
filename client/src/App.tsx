import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { LoadingSpinner } from './components/ui'

const HomePage = lazy(() => import('./pages/HomePage'))
const SpeakingPage = lazy(() => import('./pages/SpeakingPage'))
const WritingPage = lazy(() => import('./pages/WritingPage'))
const ShadowingPage = lazy(() => import('./pages/ShadowingPage'))
const PronunciationPage = lazy(() => import('./pages/PronunciationPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const SectionFallback = () => (
  <div className="grid min-h-[calc(100vh-4.25rem)] place-items-center px-4">
    <div className="rounded-2xl border border-border bg-surface px-6 py-5 text-center text-muted shadow-[var(--app-shadow-soft)]">
      <LoadingSpinner className="mx-auto text-secondary" />
      <p className="mt-3 text-xs">Opening this section…</p>
    </div>
  </div>
)

const Section = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<SectionFallback />}>{children}</Suspense>
)

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          index
          element={
            <Section>
              <HomePage />
            </Section>
          }
        />
        <Route
          path="speaking"
          element={
            <Section>
              <SpeakingPage />
            </Section>
          }
        />
        <Route
          path="writing"
          element={
            <Section>
              <WritingPage />
            </Section>
          }
        />
        <Route
          path="shadowing"
          element={
            <Section>
              <ShadowingPage />
            </Section>
          }
        />
        <Route
          path="pronunciation"
          element={
            <Section>
              <PronunciationPage />
            </Section>
          }
        />
        <Route
          path="pricing"
          element={
            <Section>
              <PricingPage />
            </Section>
          }
        />
        <Route
          path="settings"
          element={
            <Section>
              <SettingsPage />
            </Section>
          }
        />
        <Route
          path="help"
          element={
            <Section>
              <HelpPage />
            </Section>
          }
        />
        <Route
          path="*"
          element={
            <Section>
              <NotFoundPage />
            </Section>
          }
        />
      </Route>
    </Routes>
  )
}
