import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App'
import { startAnimatedFavicon } from './lib/animatedFavicon'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML arrives prerendered (see the prerender plugin in vite.config.ts); dev starts empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

startAnimatedFavicon()
