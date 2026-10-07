// All project copy for the portfolio. Placeholders are in [BRACKETS].
const GH = 'https://github.com/vishalsoni7'
export const ATM_APP_URL = import.meta.env.VITE_ATM_APP_URL || '[ATM STATUS LIVE URL]'

export interface Flagship {
  id: 'atm' | 'deploy'
  fig: string
  name: string
  blurb: string
  points: string[]
  stack: string[]
  codeUrl?: string
  liveUrl?: string
  note?: string
}

export const flagships: Flagship[] = [
  {
    id: 'atm',
    fig: 'FIG. 01 — LIVE PILOT · BHILWARA · 2026',
    name: 'ATM Status',
    blurb:
      'Tells people whether a nearby ATM is working before they walk there. Anyone can report a status in two taps, no signup, and the map updates for everyone.',
    points: [
      'Nearby search on PostGIS via Supabase RPC functions',
      'City data seeded from OpenStreetMap with a CSV → SQL pipeline',
      'Auto-flags ATMs as “possibly removed” from repeated reports',
    ],
    stack: ['React', 'TypeScript', 'Vite', 'Leaflet', 'Supabase', 'PostGIS'],
    codeUrl: `${GH}/atm-status`,
    liveUrl: ATM_APP_URL,
  },
  {
    id: 'deploy',
    fig: 'FIG. 02 — DEV TOOLING · 2026',
    name: 'Deploy Tracker',
    // TODO(Vishal): verify blurb, points and stack — written without access to the private repo
    blurb:
      'For teams that merge to staging but ship to production by cherry-picking. Shows every merged branch and which ones still haven’t reached production, so release day is a checklist, not guesswork.',
    points: [
      'Lists every branch merged into staging',
      'Flags what still needs cherry-picking to production',
      'One view to check before every release',
    ],
    stack: ['React', 'TypeScript', 'GitHub API'],
    note: 'PRIVATE REPO · DEMO ON REQUEST',
  },
]

export interface Part {
  code: string
  name: string
  description: string
  stack: string
  codeUrl: string
  liveUrl?: string
}

export const parts: Part[] = [
  {
    code: 'P-03',
    name: 'Kaamgar',
    description:
      'Attendance, holidays and payroll-ready reports for contractors. OTP login, Hindi + English.',
    stack: 'React · MUI · Express · MongoDB',
    codeUrl: `${GH}/contractor-app`,
    liveUrl: 'https://kaamgar.vercel.app',
  },
  {
    code: 'P-04',
    name: 'GharBanao',
    description: 'Vendors, purchases, bill photos and payments for a house build, with reports.',
    stack: 'React · Recharts · Express · MongoDB',
    codeUrl: `${GH}/ghar-banao`,
    liveUrl: 'https://gharbanao-chi.vercel.app',
  },
  {
    code: 'P-05',
    name: 'Chatbot Flow Builder',
    description: 'Drag-and-drop chatbot flows with node settings, validation and autosave.',
    stack: 'React · TypeScript · React Flow',
    codeUrl: `${GH}/bitespeed-flow`,
  },
  {
    code: 'P-06',
    name: 'Text Highlighter',
    description: 'Save highlights from any page and manage them from the popup.',
    stack: 'React · TypeScript · Chrome APIs',
    codeUrl: `${GH}/web-text-heighlight`,
  },
]

// Sample data for the Deploy Tracker demo. 0 = shipped, 1 = needs cherry-pick, 2 = staging only
export const demoBranches: Array<{ name: string; state: 0 | 1 | 2 }> = [
  { name: 'feature/search-filters', state: 0 },
  { name: 'fix/payment-retry', state: 1 },
  { name: 'feature/dark-mode', state: 1 },
  { name: 'fix/date-picker-tz', state: 0 },
  { name: 'chore/upgrade-vite', state: 2 },
]

// Sample pins for the Bhilwara pilot fallback (x/y are % of the map panel). st: 0 working, 1 not working, 2 no reports
export const pilotPins = [
  { x: 18, y: 30, st: 0, name: 'Station Road', bank: 'SBI' },
  { x: 34, y: 58, st: 0, name: 'Azad Chowk', bank: 'PNB' },
  { x: 52, y: 24, st: 1, name: 'Pur Road', bank: 'HDFC' },
  { x: 66, y: 64, st: 0, name: 'Subhash Nagar', bank: 'ICICI' },
  { x: 78, y: 36, st: 2, name: 'Bapu Nagar', bank: 'Axis' },
  { x: 42, y: 78, st: 1, name: 'Sanganeri Gate', bank: 'BoB' },
  { x: 24, y: 72, st: 0, name: 'RC Vyas Colony', bank: 'SBI' },
  { x: 86, y: 70, st: 0, name: 'Shastri Nagar', bank: 'Canara' },
  { x: 60, y: 46, st: 0, name: 'Collectorate', bank: 'SBI' },
] as const

export const GITHUB_URL = GH

export const projectCta = { code: 'CODE ↗', live: 'TRY THE PILOT ↗' }

// Copy for the nearby-ATM demo (NearbyAtmsPreview).
export const atmDemo = {
  idle: {
    label: 'LIVE DEMO · USES YOUR LOCATION ONCE',
    title: 'Which ATMs near you are working?',
    text: 'Try the core of the app right here. Your location stays in your browser and is never stored.',
    find: '◎ FIND ATMS NEAR ME',
    pilot: 'or explore the Bhilwara pilot',
  },
  locating: 'LOCATING YOU…',
  loading: 'LOOKING FOR ATMS…',
  empty: 'No ATMs found within 2 km of you.',
  errors: {
    lookup:
      'Couldn’t reach the ATM map service. It’s a free public service and is sometimes overloaded, so try again in a moment.',
    unavailable:
      'Your browser couldn’t find your location. Check that Location Services is on for this browser.',
    timeout: 'Finding your location took too long.',
  },
  retry: 'TRY AGAIN',
  startOver: '↺ START OVER',
  selected: 'SELECTED ATM',
  selectedSample: 'SELECTED ATM · SAMPLE',
  report: 'REPORT IN THE APP ↗',
  nearTag: 'NEAR YOU',
  nearLabel: 'Within 2 km',
  pilotTag: 'PILOT CITY · SAMPLE DATA',
  pilotLabel: 'Bhilwara, Rajasthan',
  ringLabels: ['1 km', '2 km'],
  you: 'You are here',
  status: { working: 'Working', not_working: 'Not working', unknown: 'No reports yet' },
  legend: { working: 'Working', not_working: 'Not working', unknown: 'No reports' },
  noReports: 'Nobody has reported it yet',
  captions: {
    idle: 'Hit the button to see ATMs within 2 km of you',
    live: 'Live statuses from ATM Status reports · hover or tap a pin',
    osm: 'ATM Status isn’t live in your city yet. These are real ATM locations from OpenStreetMap, waiting for their first report.',
    pilot: 'Sample statuses for the Bhilwara pilot · hover or tap a pin',
    denied: 'Location was blocked, so these are sample statuses for the Bhilwara pilot.',
    unsupported:
      'Location isn’t available here, so these are sample statuses for the Bhilwara pilot.',
  },
}

// Copy for the Deploy Tracker demo (DeployDemo). Branches above are sample data.
export const deployDemo = {
  header: 'STAGING → PRODUCTION',
  pending: (n: number) => `${n} PENDING`,
  allClear: 'ALL CLEAR ✓',
  status: ['Shipped to prod', 'Needs cherry-pick', 'Staging only'],
  actions: { pick: 'MARK PICKED →', undo: 'UNDO', none: '—' },
  caption: '↑ Click a branch to mark it cherry-picked (demo)',
}
