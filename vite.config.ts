import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build, defineConfig, type Connect, type Plugin } from 'vite'
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

// After the client build, render <App /> to HTML with an SSR build of src/entry-server.tsx and
// put it inside #root in dist/index.html. main.tsx then hydrates it instead of starting empty.
// Crawlers that don't run JavaScript (AI bots, link previews) see the full page, and the
// headline paints before the JS loads. CSS module class names are stable across both builds.
const prerender: Plugin = {
  name: 'prerender-index',
  apply: (config, { command }) => command === 'build' && !config.build?.ssr,
  async closeBundle() {
    const root = process.cwd()
    const ssrDir = resolve(root, 'node_modules/.tmp/ssr')
    await build({
      configFile: false,
      root,
      logLevel: 'warn',
      plugins: [react()],
      build: { ssr: 'src/entry-server.tsx', outDir: ssrDir, emptyOutDir: true },
    })
    const { render } = (await import(pathToFileURL(resolve(ssrDir, 'entry-server.js')).href)) as {
      render: () => string
    }
    const indexFile = resolve(root, 'dist/index.html')
    const html = await readFile(indexFile, 'utf8')
    const marker = '<div id="root"></div>'
    if (!html.includes(marker)) throw new Error(`prerender: ${marker} not found in index.html`)
    await writeFile(indexFile, html.replace(marker, `<div id="root">${render()}</div>`))
  },
}

export default defineConfig({
  plugins: [react(), legacyV1, prerender],
})
