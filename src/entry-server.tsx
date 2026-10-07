import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

// Used only at build time to prerender the page into dist/index.html, so crawlers and link
// previews that don't run JavaScript still get the full content.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
