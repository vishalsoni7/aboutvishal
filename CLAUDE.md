# Vishal Soni — Portfolio (Blueprint design)

Personal portfolio for Vishal Soni, a frontend developer in Jaipur. It's a single page styled like an engineering blueprint. Two flagship projects, **ATM Status** and **Deploy Tracker**, each have a working mini-demo. The site deploys to Netlify at vishalsoni.netlify.app.

## Source of truth
- Visual design: `reference/Blueprint.dc.html`. It's an editor file, so ignore `<x-dc>`, `<helmet>`, `<sc-if>`, `<sc-for>` and `{{ }}` holes. Read it for exact sizes, spacing, colours and copy. Its `<script>` block shows the intended demo logic.
- Specs: `docs/01-design-spec.md` (layout and tokens), `docs/02-content.md` (copy), `docs/03-interactions.md` (behaviour).
- Build order: `docs/04-build-plan.md`. Do one phase at a time and stop when its "Done when" list passes.

## Stack
- Vite + React 18 + TypeScript (strict), npm.
- Styling: CSS variables in `src/styles/tokens.css`, global rules in `src/styles/global.css`, and one `*.module.css` per component. No Tailwind, no UI kit, no CSS-in-JS.
- Fonts from Google Fonts: Chakra Petch (500, 700) for display and IBM Plex Mono (400, 600) for everything else.
- No new runtime dependencies without asking. The nearby-ATM demo is dependency-free on purpose.
- Lint and format with ESLint (the Vite React TS template) and Prettier.

## Layout of the code
```
src/
  main.tsx, App.tsx
  styles/tokens.css, global.css
  data/        profile.ts, projects.ts, skills.ts  ← ALL copy lives here, not in components
  hooks/       usePointer.ts (rAF-throttled mouse position), usePrefersReducedMotion.ts
  lib/         geo.ts, atmSources.ts
  components/  Crosshair, Header, Hero, AtmSection, NearbyAtmsPreview, DeploySection,
               DeployDemo, PartsList, About, Contact, Footer
public/        resume.pdf, og-image.png, favicon.svg
```
Starter files for `tokens.css`, `projects.ts` and `NearbyAtmsPreview.tsx` are in `starter/src/`. Move them into `src/` in Phase 1.

## Rules
- Match the design closely: colours only from tokens, both fonts, the 96/16 px blueprint grid background, square corners (no border-radius except on round dots and pins).
- Semantic HTML: real `<a>` and `<button>`, one `<h1>`, section `<h2>`s, and `aria-label` on icon-only controls. Touch targets must be at least 44 px.
- Respect `prefers-reduced-motion` (no ping animation, no crosshair easing). Hide the crosshair on touch devices (`@media (pointer: coarse)`).
- Never ship made-up data as if it were real. Demo data must be labelled as sample data on the page.
- The visitor's location goes only to the two ATM lookups. Never log or store it.
- Env vars use the `VITE_` prefix: `VITE_ATM_SUPABASE_URL`, `VITE_ATM_SUPABASE_ANON_KEY`, `VITE_ATM_APP_URL`. Keep a `.env.example` in sync.
- Do not mention or link any Afton Tickets code or projects. Afton appears only as the employer in the Experience block.

## Old portfolio at /v1
- The previous CRA portfolio is kept in `legacy/v1/` (source) and served at `/v1` from a prebuilt snapshot in `public/v1/`. Don't edit `public/v1/` by hand. Change `legacy/v1/` and run `npm run build:v1`.
- `legacy/`, `public/v1/` are excluded from ESLint, Prettier and TypeScript. Don't restyle or migrate them.
- Routing: `public/_redirects` sends `/v1` and `/v1/*` to `/v1/index.html` **before** the `/*` catch-all. Any `netlify.toml` redirects (Phase 6) must keep that order. `vite.config.ts` mirrors this for dev and preview.

## Commands
- `npm run dev`: local server
- `npm run build`: type-check and production build (must pass before every commit)
- `npm run lint`
- `npm run build:v1`: rebuild the old portfolio into `public/v1`
