// Page copy outside the project blocks. Placeholders are in [BRACKETS].
import { GITHUB_URL } from './projects'

export const LINKEDIN_URL = 'https://www.linkedin.com/in/vishal-soni-b21a4a1b8' // from the v1 site — verify
export const EMAIL = '[YOUR EMAIL]'

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export const header = {
  brand: 'VS / PORTFOLIO',
  sheet: 'SHEET 01 OF 01 · REV 2026.09',
  nav: [
    { label: '01 ATM', href: '#atm' },
    { label: '02 DEPLOY', href: '#deploy' },
    { label: 'CONTACT', href: '#contact' },
    { label: 'GITHUB ↗', href: GITHUB_URL, external: true },
  ] satisfies NavLink[],
}

export const hero = {
  label: '[ SPEC ] FRONTEND DEVELOPER · JAIPUR, IN · OPEN TO REMOTE',
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
  resume: { label: 'DOWNLOAD RÉSUMÉ ↗', href: '/resume.pdf' }, // [ADD PDF] to public/resume.pdf
}

export const partsList = {
  title: 'PARTS LIST — OTHER BUILDS',
  inventory: { label: 'FULL INVENTORY ON GITHUB ↗', href: GITHUB_URL },
}

export const about = {
  logTitle: 'OPERATOR LOG',
  role: 'Frontend Developer · Afton Tickets',
  dates: '[START YEAR] — PRESENT',
  summary:
    'Building the web app for a large-scale ticketing platform with React, TypeScript and Laravel/Blade.',
  materialsTitle: 'MATERIALS',
}

export const contact = {
  label: '[ END OF SHEET ] — REQUEST FOR COLLABORATION',
  headline: ['Let’s draft', 'the next build.'],
  email: EMAIL,
  links: [
    { label: 'LINKEDIN ↗', href: LINKEDIN_URL },
    { label: 'GITHUB ↗', href: GITHUB_URL },
  ],
}

export const footer = ['DRAWN BY: V. SONI', 'LOCATION: JAIPUR, IN', 'SCALE: 1:1', '© 2026']
