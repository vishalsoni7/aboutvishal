import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// The old portfolio is a prebuilt snapshot in public/v1 (source: legacy/v1, rebuild with
// `npm run build:v1`). Send /v1 routes to its index.html so its client router works.
// Netlify does the same via public/_redirects.
const toLegacyIndex: Connect.NextHandleFunction = (req, _res, next) => {
  const path = (req.url ?? '').split('?')[0]
  if ((path === '/v1' || path.startsWith('/v1/')) && !path.includes('.')) {
    req.url = '/v1/index.html'
  }
  next()
}

const legacyV1: Plugin = {
  name: 'legacy-v1-fallback',
  configureServer(server) {
    server.middlewares.use(toLegacyIndex)
  },
  configurePreviewServer(server) {
    server.middlewares.use(toLegacyIndex)
  },
}

export default defineConfig({
  plugins: [react(), legacyV1],
})
