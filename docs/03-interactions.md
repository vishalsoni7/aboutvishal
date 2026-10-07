# 03 — Interactions

## 1. Crosshair cursor (whole page)
- Two 1 px `--cyan` lines, one full width and one full height, at 70 % opacity. They follow the pointer, with a readout next to it: `X 0421 · Y 0233`. The numbers are page coordinates, zero-padded to 4 digits.
- Implementation: `usePointer()` stores the position in a ref and updates the DOM with `transform: translate3d()` inside `requestAnimationFrame`. **Don't re-render React on every mousemove.**
- Hidden when the pointer leaves the window, on `(pointer: coarse)` devices and when `prefers-reduced-motion` is set. `pointer-events: none` and `aria-hidden="true"`.
- The page cursor is `crosshair`. Links and buttons keep `pointer`.

## 2. Nearby-ATM demo (`NearbyAtmsPreview`)
A state machine: `idle → locating → loading → found | empty | error`, with `denied → pilot`.

| State | UI |
|---|---|
| idle | Centred card (copy in 02-content). The primary button calls `getCurrentPosition` with `{ timeout: 10000, maximumAge: 60000 }`. |
| locating / loading | Two expanding ping rings with a cyan dot and the text "LOCATING YOU…" / "LOOKING FOR ATMS…". Use `role="status"`. |
| found | Radar: dashed rings at 1 km and 2 km, the visitor dot in the centre, ATM pins placed by bearing and distance. Hovering, focusing or clicking a pin selects it (it grows to 24 px with a 6 px ring). The top-right card shows bank, "430 m SW of you", status dot and label, time since the last report, and a "Report in the app ↗" button. The caption below explains the data source. The 4 nearest ATMs appear as cards under the panel, and clicking one selects it. "↺ START OVER" is bottom-left. |
| pilot (denied, or "explore the pilot") | The same map UI, using the 9 sample Bhilwara pins and the caption "Sample statuses for the Bhilwara pilot". |
| empty / error | A message and a "Try again" button. |

**Data sources**, in order (implemented in `starter/src/components/NearbyAtmsPreview.tsx`):
1. The ATM Status Supabase RPC `nearby_atms(user_lat, user_lng, radius_m=2000, max_results=12)`. This is a GET to `/rest/v1/rpc/nearby_atms` with `apikey` and `Authorization` headers. It returns real statuses.
2. If that returns nothing (any city outside the pilot), OpenStreetMap Overpass: `amenity=atm` plus `amenity=bank` with `atm=yes` within 2 km. These are real locations with status "No reports yet", and the caption says ATM Status isn't live in that city yet.

**Other rules**
- Status colours: working `--green`, not working `--orange`, no reports `--slate`.
- Pins are `<button>`s with an `aria-label` like "SBI, 430 m SW, Working".
- **Privacy:** coordinates are only sent to those two endpoints and are never stored or logged.

## 3. Deploy Tracker demo (`DeployDemo`)
- Header: "STAGING → PRODUCTION", with a counter on the right. The counter reads `2 PENDING` in orange, or `ALL CLEAR ✓` in green once nothing is pending.
- Each row is a `<button>` with three parts: the branch name, a status dot and label, and an action hint.

| Row status | Action hint | Click does |
|---|---|---|
| Needs cherry-pick | "MARK PICKED →" | Marks it Shipped |
| Shipped (was pending at the start) | "UNDO" | Sets it back to Needs cherry-pick |
| Branches that start as Shipped or Staging only | "—" | Nothing |

- Caption: "↑ Click a branch to mark it cherry-picked (demo)". This is sample data, and the caption must say "demo".

## 4. Hovers and motion
- Nav links: ink → cyan. Parts-list rows and branch rows: a faint cyan wash.
- Buttons: colour change only, no scale or bounce.
- Ping animation: `scale(.2) → scale(1.4)`, fading out over 1.8 s, with the second ring delayed by 0.9 s. Disable it under reduced motion.
- Nav links scroll smoothly to their sections (`scroll-behavior: smooth`, turned off under reduced motion).
