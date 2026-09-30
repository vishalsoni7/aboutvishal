# 02 — Content (all copy)

All of this belongs in `src/data/*.ts`, not hard-coded in components. Anything in `[BRACKETS]` is a placeholder Vishal still has to fill in.

## Meta
- Title: `Vishal Soni — Frontend Developer`
- Description: `Frontend developer in Jaipur building useful web apps with React and TypeScript. Featuring ATM Status and Deploy Tracker.`
- URL: `https://vishalsoni.netlify.app/`

## Header
- "VS / PORTFOLIO" · "SHEET 01 OF 01 · REV 2026.09"
- Nav: 01 ATM (`#atm`) · 02 DEPLOY (`#deploy`) · CONTACT (`#contact`) · GITHUB ↗ (`https://github.com/vishalsoni7`)

## Hero
- Label: `[ SPEC ] FRONTEND DEVELOPER · JAIPUR, IN · OPEN TO REMOTE`
- H1: `Vishal Soni / engineers useful / interfaces.` (line breaks as shown; "engineers" in cyan)
- Intro: `2.5 years of production React + TypeScript. The two builds below are live demos — find working ATMs near you, then clear a release queue.`
- Spec table: EXPERIENCE 2.5 YRS · PRODUCTS 06 · REPOS 27 · button "DOWNLOAD RÉSUMÉ ↗" → `/resume.pdf` **[ADD PDF]**

## ATM Status (`#atm`)
- Label: `FIG. 01 — LIVE PILOT · BHILWARA · 2026`
- H2: `ATM Status`
- Blurb: `Tells people whether a nearby ATM is working before they walk there. Anyone can report a status in two taps, no signup, and the map updates for everyone.`
- Bullets:
  - Nearby search on PostGIS via Supabase RPC functions
  - City data seeded from OpenStreetMap with a CSV → SQL pipeline
  - Auto-flags ATMs as "possibly removed" from repeated reports
- Chips: React · TypeScript · Vite · Leaflet · Supabase · PostGIS
- Buttons: `CODE ↗` → `https://github.com/vishalsoni7/atm-status` · `TRY THE PILOT ↗` → **[ATM STATUS LIVE URL]**
- Demo copy (idle card):
  - Label: "LIVE DEMO · USES YOUR LOCATION ONCE"
  - Title: "Which ATMs near you are working?"
  - Text: "Try the core of the app right here. Your location stays in your browser and is never stored."
  - Buttons: "◎ FIND ATMS NEAR ME" and "or explore the Bhilwara pilot"

## Deploy Tracker (`#deploy`) — ⚠ verify, written without repo access
- Label: `FIG. 02 — DEV TOOLING · 2026`
- H2: `Deploy Tracker`
- Blurb: `For teams that merge to staging but ship to production by cherry-picking. Shows every merged branch and which ones still haven't reached production, so release day is a checklist, not guesswork.`
- Bullets:
  - Lists every branch merged into staging
  - Flags what still needs cherry-picking to production
  - One view to check before every release
- Chips: React · TypeScript · GitHub API **[VERIFY STACK]**
- Note: `PRIVATE REPO · DEMO ON REQUEST`
- Demo branches (sample): `feature/search-filters` (shipped), `fix/payment-retry` (needs cherry-pick), `feature/dark-mode` (needs cherry-pick), `fix/date-picker-tz` (shipped), `chore/upgrade-vite` (staging only)

## Parts list — "Other builds"

| Code | Name | Description | Stack | Link |
|---|---|---|---|---|
| P-03 | Kaamgar | Attendance, holidays and payroll-ready reports for contractors. OTP login, Hindi + English. | React · MUI · Express · MongoDB | github.com/vishalsoni7/contractor-app (live: kaamgar.vercel.app) |
| P-04 | GharBanao | Vendors, purchases, bill photos and payments for a house build, with reports. | React · Recharts · Express · MongoDB | github.com/vishalsoni7/ghar-banao (live: gharbanao-chi.vercel.app) |
| P-05 | Chatbot Flow Builder | Drag-and-drop chatbot flows with node settings, validation and autosave. | React · TypeScript · React Flow | github.com/vishalsoni7/bitespeed-flow |
| P-06 | Text Highlighter | Save highlights from any page and manage them from the popup. | React · TypeScript · Chrome APIs | github.com/vishalsoni7/web-text-heighlight |

Header link: `FULL INVENTORY ON GITHUB ↗` → `https://github.com/vishalsoni7`

## About
- Operator log:
  - Title: `Frontend Developer · Afton Tickets`
  - Dates: `[START YEAR] — PRESENT`
  - Text: `Building the web app for a large-scale ticketing platform with React, TypeScript and Laravel/Blade.`
- Materials: React, TypeScript, JavaScript, Vite, Tailwind, Material UI, React Flow, Leaflet, Node.js, Express, NestJS, MongoDB, Supabase, PostgreSQL, PHP, Laravel

## Contact (`#contact`)
- Label: `[ END OF SHEET ] — REQUEST FOR COLLABORATION`
- H2: `Let's draft / the next build.`
- Buttons: **[YOUR EMAIL]** (mailto) · `LINKEDIN ↗` **[LINKEDIN URL]** · `GITHUB ↗`

## Footer
`DRAWN BY: V. SONI` · `LOCATION: JAIPUR, IN` · `SCALE: 1:1` · `© 2026`
