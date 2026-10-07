# 04 — Build plan

Do one phase per Claude Code session. When a phase is done, commit, run `/clear`, then paste the next prompt.

---

## Phase 1: Scaffold and tokens
**Prompt**
```
Read CLAUDE.md, docs/ and reference/Blueprint.dc.html. Do Phase 1 of docs/04-build-plan.md:
scaffold Vite + React + TS in this folder, add ESLint/Prettier, move starter/src files into src/,
create global.css (reset, fonts, blueprint grid background, focus ring, smooth scroll with
reduced-motion guard), and set up index.html meta. Plan first, then build.
```
**Done when**
- `npm run dev` shows an empty blueprint-grid page with both fonts loaded.
- `npm run build` and `npm run lint` pass.
- `.env.example` lists the three `VITE_ATM_*` vars.

## Phase 2: Static sections
**Prompt**
```
Phase 2: build Header, Hero, PartsList, About, Contact and Footer as static components with CSS
modules, pulling all copy from src/data. Match reference/Blueprint.dc.html sizes and spacing
at 1440px. Leave the ATM and Deploy sections as placeholders.
```
**Done when**
- At 1440 px the page matches the canvas top to bottom, apart from the two demo areas.
- All copy comes from `src/data`.
- There's exactly one `<h1>`.

## Phase 3: ATM Status section and live demo
**Prompt**
```
Phase 3: build AtmSection with the left text column and NearbyAtmsPreview on the right, following
docs/03-interactions.md §2. Start from starter/src/components/NearbyAtmsPreview.tsx, restyle it
with a CSS module to match the design (560px panel, nearest-ATM cards, pilot fallback with the 9
sample Bhilwara pins from the reference file, START OVER). Keep geo/data code in src/lib.
```
**Done when**
- Allowing location shows ATMs. Outside Bhilwara they come from OpenStreetMap.
- Blocking location shows the pilot map.
- Pins and cards are keyboard-focusable and selectable.
- Without the Supabase env vars it falls back to OpenStreetMap and doesn't crash.

## Phase 4: Deploy Tracker section and demo
**Prompt**
```
Phase 4: build DeploySection and DeployDemo per docs/03-interactions.md §3 (branch table on the
left 8 columns, text on the right 4). Rows are buttons; pending counter updates live.
```
**Done when**
- Clicking toggles rows as the spec describes.
- The counter shows `ALL CLEAR ✓` when nothing is pending.
- Rows work with Tab and Enter.

## Phase 5: Crosshair, polish, responsive
**Prompt**
```
Phase 5: add the Crosshair (docs/03-interactions.md §1) using a rAF usePointer hook with no React
re-render per mousemove. Then implement the responsive rules in docs/01-design-spec.md for
900–1199px and <900px. Check 390px, 768px, 1024px, 1440px.
```
**Done when**
- The crosshair runs smoothly and is hidden on touch devices and under reduced motion.
- There's no horizontal scroll at 390 px.
- Tap targets are at least 44 px.

## Phase 6: Launch prep
**Prompt**
```
Phase 6: go through docs/05-launch-checklist.md. Add SEO meta, Open Graph image placeholder,
JSON-LD Person, favicon, netlify.toml, 404 fallback. List every remaining [PLACEHOLDER] for me.
Run build + lint and report Lighthouse-relevant issues you can spot in the code.
```
**Done when**
- Every item in the checklist is ticked or listed for you to handle.
