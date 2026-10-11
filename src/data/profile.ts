// Page copy outside the project blocks. Placeholders are in [BRACKETS].
import { GITHUB_URL } from './projects'
import { skills } from './skills'

export const LINKEDIN_URL = 'https://www.linkedin.com/in/vishal-soni07'
export const EMAIL = 'vishsoni043@gmail.com'

export interface NavLink {
  label: string
  href: string
  external?: boolean
  mobile?: boolean // still shown below 900px
}

export const header = {
  brand: 'VS / PORTFOLIO',
  brandShort: 'VS',
  sheet: 'SHEET 01 OF 01 · REV 2026.09',
  nav: [
    { label: '01 ATM', href: '/#atm' },
    { label: '02 DEPLOY', href: '/#deploy' },
    { label: 'CONTACT', href: '/#contact' },
    { label: 'GITHUB ↗', href: GITHUB_URL, external: true, mobile: true },
  ] satisfies NavLink[],
}

export const hero = {
  label: '[ SPEC ] SOFTWARE ENGINEER · RAJASTHAN, IN · OPEN TO REMOTE',
  // Each entry is one line of the h1; `accent` words render in cyan.
  headline: [
    [{ text: 'Vishal Soni' }],
    [{ text: 'engineers', accent: true }, { text: ' useful' }],
    [{ text: 'interfaces.' }],
  ],
  intro:
    '2.5 years of production React + TypeScript. The two builds below are live demos — find working ATMs near you, then clear a release queue.',
  spec: [
    { label: 'EXPERIENCE', value: '2.5 YRS' },
    { label: 'PRODUCTS', value: '06' },
    { label: 'REPOS', value: '27' },
  ],
  resume: {
    label: 'VIEW RÉSUMÉ ↗',
    // Opens Drive's preview in a new tab. Keep the file shared as "Anyone with the link".
    // Served from public/resume.pdf so it's on our own domain. Replace that file to update it.
    href: '/resume.pdf',
  },
}

export const partsList = {
  title: 'PARTS LIST — OTHER BUILDS',
  inventory: { label: 'FULL INVENTORY ON GITHUB ↗', href: GITHUB_URL },
}

export interface Role {
  title: string
  type: string
  dates: string
  current?: boolean
}

export interface Company {
  name: string
  location: string
  roles: Role[] // newest first; several roles = a progression at the same company
  skills: string[]
}

const NOT_AT_HANABI = ['Leaflet', 'PostgreSQL', 'PHP', 'Laravel']

// From LinkedIn, newest first.
const experience: Company[] = [
  {
    name: 'Origins AI',
    location: 'Bengaluru, Karnataka · Remote',
    roles: [
      {
        title: 'Frontend Developer',
        type: 'Full-time',
        dates: 'JAN 2025 — PRESENT',
        current: true,
      },
    ],
    skills,
  },
  {
    name: 'Hanabi Technologies',
    location: 'Bengaluru, Karnataka · Remote',
    roles: [
      { title: 'Software Engineer', type: 'Full-time', dates: 'JUL 2024 — DEC 2024' },
      { title: 'Software Engineer Intern', type: 'Internship', dates: 'JAN 2024 — JUN 2024' },
    ],
    skills: skills.filter((s) => !NOT_AT_HANABI.includes(s)),
  },
]

export const about = {
  logTitle: 'OPERATOR LOG',
  materialsTitle: 'MATERIALS',
  experience,
}

// GitHub contribution graph under the Operator Log (ContributionStrip.tsx). Real data, fetched
// at build time; the block is left out when the fetch fails.
export const activity = {
  title: 'ACTIVITY TRACE — GITHUB',
  heading: (total: number) =>
    `${total.toLocaleString('en-US')} contributions in the last 12 months`,
  asOf: (date: string) => `AS OF ${date}`,
  months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  weekdays: ['', 'MON', '', 'WED', '', 'FRI', ''],
  idle: 'HOVER A CELL TO READ IT',
  cell: (count: number, date: string) =>
    `${date} · ${count === 0 ? 'NO' : count} CONTRIBUTION${count === 1 ? '' : 'S'}`,
  less: 'LESS',
  more: 'MORE',
  profile: { label: 'PROFILE ↗', href: GITHUB_URL },
}

export const contact = {
  label: '[ END OF SHEET ] — REQUEST FOR COLLABORATION',
  headline: ['Let’s draft', 'the next build.'],
  email: { label: 'GMAIL', href: `mailto:${EMAIL}`, ariaLabel: `Email ${EMAIL}` },
  links: [
    { label: 'LINKEDIN ↗', href: LINKEDIN_URL },
    { label: 'GITHUB ↗', href: GITHUB_URL },
  ],
}

export const footer = ['DRAWN BY: V. SONI', 'LOCATION: RAJASTHAN, IN', 'SCALE: 1:1', '© 2026']

// Redline mode (Redlines.tsx): header toggle and the legend shown while it's on.
export const redlines = {
  toggle: 'REDLINES',
  legend: 'REDLINE MODE · MEASURED LIVE FROM THE DOM',
  close: 'ESC TO CLOSE',
}

// Crosshair readout labels (Crosshair.tsx).
export const crosshair = { lock: 'LOCK', link: 'LINK', button: 'BUTTON' }
