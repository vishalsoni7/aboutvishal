import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Connect, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// The old portfolio is a prebuilt snapshot in public/v1 (source: legacy/v1, rebuild with
// `npm run build:v1`). Page routes under /v1 get its index.html so its client router works;
// its files (JS, CSS, images, favicon) are served as normal. Netlify does the same via
// public/_redirects. The page is sent directly rather than by rewriting req.url, because the
// rewrite ran after Vite's static handler and /v1 fell through to the new site.
const legacyIndex = (file: string): Connect.NextHandleFunction => {
  return (req, res, next) => {
    const path = (req.url ?? '').split('?')[0]
    if ((path !== '/v1' && !path.startsWith('/v1/')) || path.includes('.')) return next()
    readFile(file)
      .then((html) => {
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
      })
      .catch(next)
  }
}

const legacyV1: Plugin = {
  name: 'legacy-v1-fallback',
  configureServer(server) {
    server.middlewares.use(legacyIndex(resolve(server.config.publicDir, 'v1/index.html')))
  },
  configurePreviewServer(server) {
    const outDir = resolve(server.config.root, server.config.build.outDir)
    server.middlewares.use(legacyIndex(resolve(outDir, 'v1/index.html')))
  },
}

export default defineConfig({
  plugins: [react(), legacyV1],
})
