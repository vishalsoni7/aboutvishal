# 05 — Launch checklist

## Content
- [ ] Email, LinkedIn, résumé PDF (`public/resume.pdf`), Afton start year and ATM Status live URL filled in
- [ ] Deploy Tracker blurb, bullets and stack checked against the real project
- [ ] Hero numbers (2.5 yrs, 06 products, 27 repos) still accurate
- [ ] No Afton Tickets code or projects shown anywhere

## SEO and sharing
- [ ] `<title>`, meta description and canonical URL
- [ ] Open Graph and Twitter tags with a 1200×630 `og-image.png` (a screenshot of the hero works)
- [ ] JSON-LD `Person`: name, jobTitle, address (Jaipur), `sameAs` (GitHub, LinkedIn)
- [ ] `favicon.svg` (a cyan "VS" on `#0a2540`)
- [ ] `robots.txt` and `sitemap.xml`

## Accessibility
- [ ] One h1, logical h2s, and landmarks (`header`, `main`, `footer`)
- [ ] Visible focus ring on everything interactive; the whole page works by keyboard
- [ ] Muted text (`#8fb0d4` on `#0a2540`) passes 4.5:1 (it does, about 6.9:1). Don't go lighter.
- [ ] Crosshair and ping hidden under reduced motion, and the crosshair hidden on touch devices
- [ ] Demo status changes announced (`aria-live="polite"` on the selected-ATM card and the pending counter)

## Performance
- [ ] Fonts loaded with `display=swap` and preconnect to fonts.gstatic.com
- [ ] No mousemove re-renders (check with React DevTools' "Highlight updates")
- [ ] Lighthouse at least 95 for Performance, Accessibility, Best Practices and SEO on desktop

## Netlify deploy (same site as today)
1. Push the repo to GitHub, e.g. `vishalsoni7/portfolio`.
2. In Netlify, open the existing **vishalsoni** site, go to Site configuration → Build & deploy, and link it to the new repo.
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 20
3. Under Environment variables, add:
   - `VITE_ATM_SUPABASE_URL`: your Supabase project URL
   - `VITE_ATM_SUPABASE_ANON_KEY`: the same public anon key the ATM Status app ships (safe to expose)
   - `VITE_ATM_APP_URL`: the ATM Status live URL
4. Add `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```
5. Deploy, then test on a phone:
   - Allowing location should show ATMs.
   - Denying it should show the pilot map.
