# 01 — Design spec (Blueprint)

The exact values live in `reference/Blueprint.dc.html`. This page summarises them so they're easy to implement.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0a2540` | Page background (deep blueprint blue) |
| `--ink` | `#e6f1ff` | Primary text |
| `--muted` | `#8fb0d4` | Secondary text and labels |
| `--line` | `#244a73` | Dividers and borders |
| `--cyan` | `#7fd8ff` | Accent: links, crosshair, primary buttons, focus ring |
| `--cyan-soft` | `#c8efff` | Accent on hover |
| `--orange` | `#ffb347` | "Not working" and "Needs cherry-pick" |
| `--green` | `#6ff0b0` | "Working" and "Shipped" |
| `--slate` | `#6c8bb0` | "No reports" |

**Fonts**
- Display: `'Chakra Petch'` at 700 for headings and project names, often uppercase.
- Body and UI: `'IBM Plex Mono'` at 400 and 600.

**Type scale**

| Role | Font | Size | Line-height | Letter-spacing |
|---|---|---|---|---|
| Hero h1 | Chakra Petch | 112 px | 0.92 | −2 px |
| Contact h2 | Chakra Petch | 104 px | — | — |
| Project h2 | Chakra Petch | 64 px | — | — |
| Parts-list names | Chakra Petch | 26 px | — | — |
| Body | IBM Plex Mono | 15–17 px | 1.7 | — |
| Labels | IBM Plex Mono | 12–13 px | — | — |

**Background**
- Two-level grid on the whole page: a major grid every 96 px at `rgba(127,216,255,.09)` and a minor grid every 16 px at `rgba(127,216,255,.04)`.
- Map panels use a 16 px dot grid instead.

**Shape**
- Square corners everywhere. Only dots and pins are round.
- Borders are 1 px `--line`. Featured panels use 1 px `--cyan`.

## Page grid

- Max width 1440 px, centred, with 64 px side padding.
- Sections use a 12-column grid with a 32 px gap and a 1 px `--line` rule between them.

## Sections, top to bottom

1. **Header.** Title-block style, 20 px vertical padding, bottom rule.
   - Left: "VS / PORTFOLIO" (Chakra Petch 20 px, 2 px tracking).
   - Middle: "SHEET 01 OF 01 · REV 2026.09" (muted).
   - Right: nav links "01 ATM", "02 DEPLOY", "CONTACT", "GITHUB ↗".
2. **Hero.** 100 px top padding and 90 px bottom padding.
   - Columns 1–8: spec label, h1 (the word "engineers" in cyan), intro paragraph (max 700 px).
   - Columns 10–12: a spec table (Experience / Products / Repos) with a "Download résumé" button at the bottom.
3. **ATM Status (`#atm`).**
   - Columns 1–4: "FIG. 01" label, h2, blurb, 3 bullets, stack chips, CODE and TRY THE PILOT buttons.
   - Columns 5–12: the nearby-ATM demo. A 560 px panel, then a caption row and legend, then a row of 4 "nearest ATM" cards.
4. **Deploy Tracker (`#deploy`).**
   - Columns 1–8: the interactive branch table.
   - Columns 9–12: "FIG. 02" label, h2, blurb, bullets, chips, and "Private repo · demo on request".
5. **Parts list.** Rows for the other projects. Each row has four columns:

   | Width | Content |
   |---|---|
   | 70 px | Code (P-03…) |
   | 300 px | Name |
   | Remaining space | Description |
   | 320 px | Stack, plus ↗ |

   The whole row is a link. The header row has a "Full inventory on GitHub ↗" link.
6. **About.** Two columns: "Operator log" (the experience entry) and "Materials" (skill chips).
7. **Contact (`#contact`).** "[ END OF SHEET ]" label, a huge h2, then three buttons: email (primary), LinkedIn and GitHub (ghost).
8. **Footer.** A four-cell title-block strip: DRAWN BY / LOCATION / SCALE / ©.

## Components

- **Primary button:** `--cyan` background, `--bg` text, no radius, 46–52 px tall. On hover the background becomes `--cyan-soft`.
- **Ghost button:** 1 px `--cyan` border and cyan text. On hover the background becomes `rgba(127,216,255,.12)`.
- **Chip:** 12 px mono, cyan text, 1 px `--line` border, 4 × 10 px padding.
- **Row hover** (parts list and branch table): background `rgba(127,216,255,.06–.08)`.
- **Focus:** a 2 px `--cyan` outline with a 2 px offset on every interactive element.

## Responsive rules

| Breakpoint | Changes |
|---|---|
| ≥ 1200 px | As designed |
| 900–1199 px | Hero h1 → 80 px. ATM and Deploy stack into one column (visual first). Parts-list descriptions drop below the name. |
| < 900 px (mobile) | Side padding 20 px. Hero h1 → 48 px, contact h2 → 52 px. Header shows only "VS" and "GitHub ↗". The spec table sits under the hero text. The ATM demo panel becomes square (`aspect-ratio: 1`). The nearest-ATM cards become a 2 × 2 grid. The branch table drops its third column (tap the row to toggle). The footer strip becomes a 2 × 2 grid. The crosshair is hidden. |
