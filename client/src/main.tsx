import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The root application element is missing.')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4_000,
          style: {
            color: 'var(--app-foreground)',
            background: 'var(--app-elevated)',
            border: '1px solid var(--app-border)',
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
)
