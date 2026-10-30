import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import './index.css'
import App from './App'

// Headlines are split into words for their reveals, so wait for the real
// fonts before the first measure (with a timeout so a slow font never blocks).
const faces = ['400 1em "Geist Variable"', '500 1em "Geist Variable"', '400 1em "Geist Mono Variable"']
const fontsReady = Promise.all(faces.map((f) => document.fonts.load(f)))
const timeout = new Promise((resolve) => setTimeout(resolve, 2500))

Promise.race([fontsReady, timeout]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
