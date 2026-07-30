import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/caveat'
import '@fontsource/kalam'
import '@fontsource/kalam/700.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
