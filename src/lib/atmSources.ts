/**
 * Data sources for the nearby-ATM demo, tried in order:
 *   1. ATM Status's Supabase `nearby_atms` RPC — every ATM in India, with live reported statuses
 *   2. OpenStreetMap, only if (1) finds nothing nearby (e.g. outside India) or fails — real ATM
 *      locations, status unknown. Asks Nominatim (run by the
 *      OpenStreetMap Foundation, fast and dependable) and falls back to Overpass if it fails.
 * The visitor's coordinates go only to these lookups. Never log or store them.
 */
import { bearingDeg, distanceM } from './geo'

const SUPABASE_URL = import.meta.env.VITE_ATM_SUPABASE_URL ?? ''
const SUPABASE_KEY = import.meta.env.VITE_ATM_SUPABASE_ANON_KEY ?? ''
// The ATM Status database caps searches at 100 km (supabase/migrations/0006_radius_100km.sql) and
// returns only the nearest MAX_RESULTS, so a wide radius costs nothing. OpenStreetMap is thin
// outside cities and laptops locate by Wi-Fi, so 2 km often finds nothing. The radar scales to
// the farthest ATM it shows.
export const SEARCH_RADIUS_M = 100_000
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
  reportedAt: string | null // latest report, even if too old to count
}

// Mirrors ATM Status's own rules (atm-status/src/lib/status.ts): a report counts for 10 hours,
// "suspected removed" ATMs are unknown, and the legacy 'no_cash' status means not working.
export const FRESH_MS = 10 * 60 * 60 * 1000

function currentStatus(
  lastStatus: string | null,
  reportedAt: string | null,
  lifecycle: string,
): AtmStatus {
  if (lifecycle === 'suspected_removed' || !lastStatus || !reportedAt) return 'unknown'
  if (Date.now() - new Date(reportedAt).getTime() > FRESH_MS) return 'unknown'
  return lastStatus === 'working' ? 'working' : 'not_working'
}

// ATM Status's `nearby_atms` RPC (supabase/migrations/0006_radius_100km.sql). Its database
// holds ATMs for all of India, seeded from OpenStreetMap, plus the app's live reports.
async function fromAtmStatus(lat: number, lng: number): Promise<NearbyAtm[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return []
  const q = new URLSearchParams({
    user_lat: String(lat),
    user_lng: String(lng),
    radius_m: String(SEARCH_RADIUS_M),
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
    lifecycle: string
    distance_m: number
    last_status: string | null
    last_reported_at: string | null
  }> = await res.json()
  return rows.map((r) => ({
    id: String(r.id),
    bank: r.bank || 'ATM',
    distance: r.distance_m,
    bearing: bearingDeg(lat, lng, r.lat, r.lng),
    status: currentStatus(r.last_status, r.last_reported_at, r.lifecycle),
    reportedAt: r.last_reported_at,
  }))
}

// Fallback: public Overpass instances, queried in parallel; the first good answer wins and the rest are
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

interface OsmAtm {
  id: string
  bank: string
  lat: number
  lng: number
}

// Nominatim's structured search for amenity=atm inside a box around the visitor.
// Nominatim ranks by importance, not distance, so search a small box first and widen only if
// it's empty; otherwise a big box can skip the ATM round the corner.
const NOMINATIM_BOXES_M = [2000, 10000, 50000]

async function fromNominatim(lat: number, lng: number): Promise<OsmAtm[]> {
  for (const size of NOMINATIM_BOXES_M) {
    const found = await searchNominatim(lat, lng, size)
    if (found.length) return found
  }
  return []
}

async function searchNominatim(lat: number, lng: number, size: number): Promise<OsmAtm[]> {
  const dLat = size / 111320
  const dLng = size / (111320 * Math.cos((lat * Math.PI) / 180))
  const q = new URLSearchParams({
    format: 'jsonv2',
    amenity: 'atm',
    viewbox: [lng - dLng, lat + dLat, lng + dLng, lat - dLat].map((n) => n.toFixed(5)).join(','),
    bounded: '1',
    limit: '40',
    extratags: '1',
  })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${q}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) throw new Error(`nominatim ${res.status}`)
  const rows: Array<{
    osm_type: string
    osm_id: number
    lat: string
    lon: string
    category: string
    type: string
    name?: string
    extratags?: Record<string, string> | null
  }> = await res.json()
  return rows
    .filter((r) => r.category === 'amenity' && (r.type === 'atm' || r.type === 'bank'))
    .map((r) => ({
      id: `osm-${r.osm_type}-${r.osm_id}`,
      bank: r.extratags?.operator || r.extratags?.brand || r.name || 'ATM',
      lat: Number(r.lat),
      lng: Number(r.lon),
    }))
}

async function fromOverpass(lat: number, lng: number): Promise<OsmAtm[]> {
  const around = `around:10000,${lat},${lng}`
  const query = `[out:json][timeout:15];(node(${around})[amenity=atm];node(${around})[amenity=bank][atm=yes];);out 30;`
  const json = await queryOverpass(query)
  return json.elements.map((e) => ({
    id: `osm-node-${e.id}`,
    bank: e.tags?.operator || e.tags?.brand || e.tags?.name || 'ATM',
    lat: e.lat,
    lng: e.lon,
  }))
}

async function fromOpenStreetMap(lat: number, lng: number): Promise<NearbyAtm[]> {
  const found = await fromNominatim(lat, lng).catch(() => fromOverpass(lat, lng))
  return found
    .map((a) => ({
      id: a.id,
      bank: a.bank,
      distance: distanceM(lat, lng, a.lat, a.lng),
      bearing: bearingDeg(lat, lng, a.lat, a.lng),
      status: 'unknown' as const,
      reportedAt: null,
    }))
    .filter((a) => a.distance <= SEARCH_RADIUS_M) // the search box's corners reach further
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
