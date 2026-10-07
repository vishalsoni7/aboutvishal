/**
 * Data sources for the nearby-ATM demo, tried in order:
 *   1. ATM Status's Supabase `nearby_atms` RPC — real ATMs with real reported statuses
 *   2. OpenStreetMap (Overpass) — real ATM locations, status unknown
 * The visitor's coordinates go only to these two requests. Never log or store them.
 */
import { bearingDeg, distanceM } from './geo'

const SUPABASE_URL = import.meta.env.VITE_ATM_SUPABASE_URL ?? ''
const SUPABASE_KEY = import.meta.env.VITE_ATM_SUPABASE_ANON_KEY ?? ''
export const RADIUS_M = 2000
const MAX_RESULTS = 12
const TIMEOUT_MS = 10000

export type AtmStatus = 'working' | 'not_working' | 'unknown'
export type AtmSource = 'atm-status' | 'osm'

export interface NearbyAtm {
  id: string
  bank: string
  distance: number // metres
  bearing: number // degrees from north
  status: AtmStatus
  reportedAt: string | null
}

async function fromAtmStatus(lat: number, lng: number): Promise<NearbyAtm[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return []
  const q = new URLSearchParams({
    user_lat: String(lat),
    user_lng: String(lng),
    radius_m: String(RADIUS_M),
    max_results: String(MAX_RESULTS),
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/nearby_atms?${q}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error('atm-status lookup failed')
  const rows: Array<{
    id: string
    bank: string | null
    lat: number
    lng: number
    distance_m: number
    last_status: string | null
    last_reported_at: string | null
  }> = await res.json()
  return rows.map((r) => ({
    id: String(r.id),
    bank: r.bank || 'ATM',
    distance: r.distance_m,
    bearing: bearingDeg(lat, lng, r.lat, r.lng),
    status: r.last_status === 'working' ? 'working' : r.last_status ? 'not_working' : 'unknown',
    reportedAt: r.last_reported_at,
  }))
}

// Public Overpass instances, queried in parallel; the first good answer wins and the rest are
// cancelled. Any one of them is often overloaded (504) or slow, so don't rely on a single one.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]
const OVERPASS_TIMEOUT_MS = 20000

type OverpassResult = {
  elements: Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }>
}

async function queryOverpass(query: string): Promise<OverpassResult> {
  const controllers = OVERPASS_ENDPOINTS.map(() => new AbortController())
  const timer = setTimeout(() => controllers.forEach((c) => c.abort()), OVERPASS_TIMEOUT_MS)
  try {
    return await Promise.any(
      OVERPASS_ENDPOINTS.map(async (url, i) => {
        const res = await fetch(url, {
          method: 'POST',
          body: new URLSearchParams({ data: query }),
          signal: controllers[i].signal,
        })
        if (!res.ok) throw new Error(`overpass ${res.status}`)
        const json: OverpassResult = await res.json()
        controllers.forEach((c, j) => j !== i && c.abort())
        return json
      }),
    )
  } catch {
    throw new Error('osm lookup failed')
  } finally {
    clearTimeout(timer)
  }
}

async function fromOpenStreetMap(lat: number, lng: number): Promise<NearbyAtm[]> {
  const around = `around:${RADIUS_M},${lat},${lng}`
  const query = `[out:json][timeout:15];(node(${around})[amenity=atm];node(${around})[amenity=bank][atm=yes];);out 30;`
  const json = await queryOverpass(query)
  return json.elements.map((e) => ({
    id: `osm-${e.id}`,
    bank: e.tags?.operator || e.tags?.brand || e.tags?.name || 'ATM',
    distance: distanceM(lat, lng, e.lat, e.lon),
    bearing: bearingDeg(lat, lng, e.lat, e.lon),
    status: 'unknown' as const,
    reportedAt: null,
  }))
}

/** Nearest ATMs, closest first. ATM Status failures fall through to OpenStreetMap. */
export async function findNearbyAtms(
  lat: number,
  lng: number,
): Promise<{ atms: NearbyAtm[]; source: AtmSource }> {
  const own = await fromAtmStatus(lat, lng).catch(() => [])
  const found = own.length
    ? { atms: own, source: 'atm-status' as const }
    : { atms: await fromOpenStreetMap(lat, lng), source: 'osm' as const }
  found.atms = found.atms.sort((a, b) => a.distance - b.distance).slice(0, MAX_RESULTS)
  return found
}
