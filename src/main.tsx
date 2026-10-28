import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import App from './App'

// Headlines are split into lines for their reveals, so measure them only
// once the real fonts are in (with a timeout so a slow font never blocks).
const faces = [
  '400 1em "Instrument Serif"',
  'italic 400 1em "Instrument Serif"',
  '400 1em "IBM Plex Sans"',
  '500 1em "IBM Plex Sans"',
  '400 1em "IBM Plex Mono"',
]
const fontsReady = Promise.all(faces.map((f) => document.fonts.load(f)))
const timeout = new Promise((resolve) => setTimeout(resolve, 2500))

Promise.race([fontsReady, timeout]).finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
