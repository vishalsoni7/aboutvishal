import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import ProjectPage from './ProjectPage'
import type { Flagship } from './data/projects'

export { flagships } from './data/projects'

// Used only at build time to prerender each page into dist, so crawlers and link previews that
// don't run JavaScript still get the full content. No `project` means the home page.
export function render(project?: Flagship['id']) {
  return renderToString(<StrictMode>{project ? <ProjectPage id={project} /> : <App />}</StrictMode>)
}
