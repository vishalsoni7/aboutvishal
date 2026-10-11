import type { Plugin } from 'vite'

// Fetches the GitHub contribution calendar once per process (dev server or build) and serves it
// as `virtual:github-contributions`, so the prerendered HTML and the client bundle get the same
// data and hydrate cleanly. With GITHUB_TOKEN (build-only, never VITE_-prefixed or it would ship
// to the browser) it uses the GraphQL API, which includes private contribution counts for the
// token's owner. Without one it reads the public profile calendar. On any failure the module
// exports null and the page leaves the block out rather than showing a fake graph.

export interface Contributions {
  total: number
  start: string // YYYY-MM-DD of days[0]
  asOf: string // YYYY-MM-DD the data was fetched
  days: Array<[count: number, level: number]> // one per day, oldest first; level 0–4
}

const ID = 'virtual:github-contributions'
const RESOLVED = '\0' + ID

type Day = { date: string; count: number; level: number }
type Calendar = {
  totalContributions: number
  weeks: Array<{
    contributionDays: Array<{ date: string; contributionCount: number; contributionLevel: string }>
  }>
}

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

async function fromGraphQL(login: string, token: string) {
  const query = `query($login: String!) { user(login: $login) { contributionsCollection {
    contributionCalendar { totalContributions weeks { contributionDays {
      date contributionCount contributionLevel } } } } } }`
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login } }),
  })
  if (!res.ok) throw new Error(`GraphQL ${res.status}`)
  const json = (await res.json()) as {
    data?: { user?: { contributionsCollection?: { contributionCalendar?: Calendar } } }
    errors?: Array<{ message: string }>
  }
  const cal = json.data?.user?.contributionsCollection?.contributionCalendar
  if (!cal) throw new Error(json.errors?.[0]?.message ?? 'no calendar in response')
  const days: Day[] = cal.weeks.flatMap((w) =>
    w.contributionDays.map((d) => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVELS[d.contributionLevel] ?? 0,
    })),
  )
  return { total: cal.totalContributions, days }
}

async function fromPublicPage(login: string) {
  const res = await fetch(`https://github.com/users/${login}/contributions`)
  if (!res.ok) throw new Error(`profile page ${res.status}`)
  const html = await res.text()
  // Counts live in the tooltips, keyed by the cell's id.
  const counts = new Map<string, number>()
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d+) contribution/)
    counts.set(m[1], n ? Number(n[1]) : 0)
  }
  const days: Day[] = []
  for (const m of html.matchAll(/<td\b[^>]*ContributionCalendar-day[^>]*>/g)) {
    const attr = (name: string) => m[0].match(new RegExp(`${name}="([^"]+)"`))?.[1]
    const date = attr('data-date')
    const id = attr('id')
    if (!date || !id) continue
    days.push({ date, count: counts.get(id) ?? 0, level: Number(attr('data-level') ?? 0) })
  }
  const total = html.match(/([\d,]+)\s+contributions?\s+in the last year/)
  if (!days.length || !total) throw new Error('calendar markup not recognised')
  return { total: Number(total[1].replace(/,/g, '')), days }
}

async function load(login: string, token?: string): Promise<Contributions | null> {
  try {
    const { total, days } = token ? await fromGraphQL(login, token) : await fromPublicPage(login)
    days.sort((a, b) => a.date.localeCompare(b.date))
    return {
      total,
      start: days[0].date,
      asOf: new Date().toISOString().slice(0, 10),
      days: days.map((d) => [d.count, d.level]),
    }
  } catch (err) {
    console.warn(`[github-contributions] skipped: ${(err as Error).message}`)
    return null
  }
}

export function githubContributions(login: string, token?: string): Plugin {
  let data: Promise<Contributions | null> | undefined
  return {
    name: 'github-contributions',
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    async load(id) {
      if (id !== RESOLVED) return
      data ??= load(login, token)
      return `export default ${JSON.stringify(await data)}`
    },
  }
}
