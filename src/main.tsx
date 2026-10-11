import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App'
import ProjectPage from './ProjectPage'
import type { Flagship } from './data/projects'
import { startAnimatedFavicon } from './lib/animatedFavicon'

const root = document.getElementById('root')!
// Project pages (projects/<slug>/index.html) mark their root with data-project.
const project = root.dataset.project as Flagship['id'] | undefined
const app = <StrictMode>{project ? <ProjectPage id={project} /> : <App />}</StrictMode>

// Production HTML arrives prerendered (see the prerender plugin in vite.config.ts); dev starts empty.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)

startAnimatedFavicon()
