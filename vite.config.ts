import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
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

// After the client build, render each page to HTML with an SSR build of src/entry-server.tsx and
// put it inside #root: dist/index.html (home) and dist/projects/<slug>/index.html for each flagship.
// main.tsx then hydrates instead of starting empty. Crawlers that don't run JavaScript (AI bots,
// link previews) see the full page, and the headline paints before the JS loads. Project pages
// reuse the home page's <head> with their own title, description, canonical, social tags and
// JSON-LD, all from src/data/projects.ts. CSS module class names are stable across both builds.
const SITE = 'https://vishalsoni.netlify.app'
const ROOT_MARKER = '<div id="root"></div>'

type PageMeta = {
  id: string
  name: string
  blurb: string
  page: { path: string; title: string; description: string }
  liveUrl?: string
  codeUrl?: string
}

const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function projectHead(html: string, p: PageMeta) {
  const url = SITE + p.page.path
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#page`,
        url,
        name: p.page.title,
        description: p.page.description,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${url}#app` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Vishal Soni', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: p.name, item: url },
          ],
        },
      },
      {
        '@type': p.id === 'atm' ? 'WebApplication' : 'SoftwareApplication',
        '@id': `${url}#app`,
        name: p.name,
        description: p.blurb,
        applicationCategory: p.id === 'atm' ? 'UtilitiesApplication' : 'DeveloperApplication',
        operatingSystem: 'Web',
        author: { '@id': `${SITE}/#person` },
        ...(p.liveUrl?.startsWith('http') ? { url: p.liveUrl } : {}),
        ...(p.codeUrl ? { sameAs: p.codeUrl } : {}),
      },
    ],
  }
  const swaps: Array<[RegExp, string]> = [
    [/<title>[\s\S]*?<\/title>/, `<title>${esc(p.page.title)}</title>`],
    [/(name="description"\s+content=")[^"]*/, `$1${esc(p.page.description)}`],
    [/(rel="canonical" href=")[^"]*/, `$1${url}`],
    [/(property="og:url" content=")[^"]*/, `$1${url}`],
    [/(property="og:title" content=")[^"]*/, `$1${esc(p.page.title)}`],
    [/(property="og:description"\s+content=")[^"]*/, `$1${esc(p.page.description)}`],
    [/(name="twitter:title" content=")[^"]*/, `$1${esc(p.page.title)}`],
    [/(name="twitter:description"\s+content=")[^"]*/, `$1${esc(p.page.description)}`],
    [
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    ],
  ]
  for (const [re, to] of swaps) {
    if (!re.test(html)) throw new Error(`prerender: ${re} not found in index.html`)
    html = html.replace(re, to)
  }
  return html
}

const prerender: Plugin = {
  name: 'prerender-pages',
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
    const { render, flagships } = (await import(
      pathToFileURL(resolve(ssrDir, 'entry-server.js')).href
    )) as {
      render: (project?: string) => string
      flagships: PageMeta[]
    }
    const indexFile = resolve(root, 'dist/index.html')
    const template = await readFile(indexFile, 'utf8')
    if (!template.includes(ROOT_MARKER))
      throw new Error(`prerender: ${ROOT_MARKER} not found in index.html`)
    await writeFile(indexFile, template.replace(ROOT_MARKER, `<div id="root">${render()}</div>`))
    for (const p of flagships) {
      const file = resolve(root, 'dist' + p.page.path, 'index.html')
      await mkdir(dirname(file), { recursive: true })
      const html = projectHead(template, p).replace(
        ROOT_MARKER,
        `<div id="root" data-project="${p.id}">${render(p.id)}</div>`,
      )
      await writeFile(file, html)
    }
  },
}

// Dev: serve the project pages too (no prerender; main.tsx renders from data-project).
const PROJECT_ROUTES: Record<string, string> = { 'atm-status': 'atm', 'deploy-tracker': 'deploy' }
const projectPagesDev: Plugin = {
  name: 'project-pages-dev',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const m = (req.url ?? '').split('?')[0].match(/^\/projects\/([a-z-]+)\/?$/)
      const id = m && PROJECT_ROUTES[m[1]]
      if (!id) return next()
      readFile(resolve(server.config.root, 'index.html'), 'utf8')
        .then((html) =>
          server.transformIndexHtml(
            req.url ?? '/',
            html.replace(ROOT_MARKER, `<div id="root" data-project="${id}"></div>`),
          ),
        )
        .then((html) => {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        })
        .catch(next)
    })
  },
}

export default defineConfig({
  plugins: [react(), legacyV1, projectPagesDev, prerender],
})
