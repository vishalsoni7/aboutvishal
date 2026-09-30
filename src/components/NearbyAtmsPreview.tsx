/**
 * NearbyAtmsPreview — a live "try it" widget for the portfolio's ATM Status section.
 *
 * Flow: visitor clicks "Find ATMs near me" → browser asks for location once →
 *   1. ATM Status's own Supabase `nearby_atms` RPC (real ATMs + real last-reported status)
 *   2. if nothing within range (ATM Status only covers the Bhilwara pilot today),
 *      real ATM locations from OpenStreetMap, shown as "No reports yet"
 *   3. if location is blocked, a friendly message plus a link to the pilot.
 *
 * No extra dependencies. Location never leaves the browser except in these two lookups.
 *
 * Env (Vite): VITE_ATM_SUPABASE_URL, VITE_ATM_SUPABASE_ANON_KEY, VITE_ATM_APP_URL
 * (the anon/publishable key is the same public key the ATM Status app already ships.)
 */
import { useMemo, useState, type CSSProperties } from 'react'

const SUPABASE_URL = import.meta.env.VITE_ATM_SUPABASE_URL ?? ''
const SUPABASE_KEY = import.meta.env.VITE_ATM_SUPABASE_ANON_KEY ?? ''
const APP_URL = import.meta.env.VITE_ATM_APP_URL ?? '#'
const RADIUS_M = 2000

type Status = 'working' | 'not_working' | 'unknown'
type Source = 'atm-status' | 'osm'

interface NearbyAtm {
  id: string
  bank: string
  lat: number
  lng: number
  distance: number // metres
  bearing: number // degrees from north
  status: Status
  reportedAt: string | null
}

type Phase =
  | { kind: 'idle' }
  | { kind: 'locating' }
  | { kind: 'loading' }
  | { kind: 'found'; atms: NearbyAtm[]; source: Source }
  | { kind: 'empty' }
  | { kind: 'denied' }
  | { kind: 'error' }

// ---------- geo helpers ----------
const toRad = (d: number) => (d * Math.PI) / 180
function distanceM(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}
function bearingDeg(aLat: number, aLng: number, bLat: number, bLng: number) {
  const y = Math.sin(toRad(bLng - aLng)) * Math.cos(toRad(bLat))
  const x =
    Math.cos(toRad(aLat)) * Math.sin(toRad(bLat)) -
    Math.sin(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.cos(toRad(bLng - aLng))
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const dirOf = (b: number) => DIRS[Math.round(b / 45) % 8]
const fmtDist = (m: number) =>
  m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`
function timeAgo(iso: string | null) {
  if (!iso) return 'No reports yet'
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (min < 60) return `Reported ${min} min ago`
  const h = Math.round(min / 60)
  return h < 48 ? `Reported ${h} h ago` : `Reported ${Math.round(h / 24)} days ago`
}

// ---------- data sources ----------
async function fromAtmStatus(lat: number, lng: number): Promise<NearbyAtm[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return []
  const q = new URLSearchParams({
    user_lat: String(lat),
    user_lng: String(lng),
    radius_m: String(RADIUS_M),
    max_results: '12',
  })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/nearby_atms?${q}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) throw new Error('atm-status lookup failed')
  const rows: Array<{
    id: string
    bank: string
    lat: number
    lng: number
    distance_m: number
    last_status: string | null
    last_reported_at: string | null
  }> = await res.json()
  return rows.map((r) => ({
    id: r.id,
    bank: r.bank || 'ATM',
    lat: r.lat,
    lng: r.lng,
    distance: r.distance_m,
    bearing: bearingDeg(lat, lng, r.lat, r.lng),
    status: r.last_status === 'working' ? 'working' : r.last_status ? 'not_working' : 'unknown',
    reportedAt: r.last_reported_at,
  }))
}

async function fromOpenStreetMap(lat: number, lng: number): Promise<NearbyAtm[]> {
  const query = `[out:json][timeout:10];(node(around:${RADIUS_M},${lat},${lng})[amenity=atm];node(around:${RADIUS_M},${lat},${lng})[amenity=bank][atm=yes];);out 30;`
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: new URLSearchParams({ data: query }),
  })
  if (!res.ok) throw new Error('osm lookup failed')
  const json: {
    elements: Array<{ id: number; lat: number; lon: number; tags?: Record<string, string> }>
  } = await res.json()
  return json.elements
    .map((e) => ({
      id: `osm-${e.id}`,
      bank: e.tags?.operator || e.tags?.brand || e.tags?.name || 'ATM',
      lat: e.lat,
      lng: e.lon,
      distance: distanceM(lat, lng, e.lat, e.lon),
      bearing: bearingDeg(lat, lng, e.lat, e.lon),
      status: 'unknown' as Status,
      reportedAt: null,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 12)
}

// ---------- component ----------
const COLORS: Record<Status, string> = {
  working: '#6ff0b0',
  not_working: '#ffb347',
  unknown: '#6c8bb0',
}
const LABELS: Record<Status, string> = {
  working: 'Working',
  not_working: 'Not working',
  unknown: 'No reports yet',
}

export default function NearbyAtmsPreview() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [selected, setSelected] = useState(0)

  const locate = () => {
    if (!navigator.geolocation) return setPhase({ kind: 'denied' })
    setPhase({ kind: 'locating' })
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setPhase({ kind: 'loading' })
        try {
          let atms = await fromAtmStatus(coords.latitude, coords.longitude).catch(() => [])
          let source: Source = 'atm-status'
          if (atms.length === 0) {
            atms = await fromOpenStreetMap(coords.latitude, coords.longitude)
            source = 'osm'
          }
          setSelected(0)
          setPhase(atms.length ? { kind: 'found', atms, source } : { kind: 'empty' })
        } catch {
          setPhase({ kind: 'error' })
        }
      },
      (err) => setPhase({ kind: err.code === err.PERMISSION_DENIED ? 'denied' : 'error' }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  const pins = useMemo(() => {
    if (phase.kind !== 'found') return []
    // place each ATM on a radar: centre = visitor, edge = RADIUS_M
    return phase.atms.map((a) => {
      const r = Math.min(a.distance / RADIUS_M, 1) * 46 // % of half-size
      return {
        ...a,
        x: 50 + Math.sin(toRad(a.bearing)) * r,
        y: 50 - Math.cos(toRad(a.bearing)) * r,
      }
    })
  }, [phase])

  const box: CSSProperties = {
    position: 'relative',
    aspectRatio: '1 / 1',
    maxHeight: 520,
    width: '100%',
    border: '1px solid #7fd8ff',
    overflow: 'hidden',
    background:
      'radial-gradient(rgba(127,216,255,.22) 1px, transparent 1px) 0 0 / 16px 16px, #0a2540',
  }
  const btn: CSSProperties = {
    minHeight: 48,
    padding: '0 22px',
    background: '#7fd8ff',
    color: '#0a2540',
    border: 0,
    fontWeight: 600,
    cursor: 'pointer',
    font: 'inherit',
  }
  const center: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    padding: 24,
    textAlign: 'center',
    color: '#e6f1ff',
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: "'IBM Plex Mono', monospace",
        color: '#e6f1ff',
      }}
    >
      <div style={box}>
        {phase.kind === 'idle' && (
          <div style={center}>
            <strong style={{ fontSize: 26 }}>Which ATMs near you are working?</strong>
            <span style={{ color: '#8fb0d4', maxWidth: 380 }}>
              Try the core of the app right here. Your location is only used for this lookup and
              never stored.
            </span>
            <button type="button" style={btn} onClick={locate}>
              ◎ Find ATMs near me
            </button>
          </div>
        )}
        {(phase.kind === 'locating' || phase.kind === 'loading') && (
          <div style={center} role="status">
            {phase.kind === 'locating' ? 'Locating you…' : 'Looking for ATMs within 2 km…'}
          </div>
        )}
        {phase.kind === 'denied' && (
          <div style={center}>
            <span>Location is blocked, so we can’t look nearby.</span>
            <a href={APP_URL} style={{ color: '#7fd8ff' }}>
              Explore the Bhilwara pilot instead ↗
            </a>
          </div>
        )}
        {(phase.kind === 'empty' || phase.kind === 'error') && (
          <div style={center}>
            <span>
              {phase.kind === 'empty'
                ? 'No ATMs found within 2 km of you.'
                : 'Couldn’t load ATMs right now.'}
            </span>
            <button type="button" style={btn} onClick={locate}>
              Try again
            </button>
          </div>
        )}
        {phase.kind === 'found' && (
          <>
            {[1, 0.5].map((f) => (
              <div
                key={f}
                style={{
                  position: 'absolute',
                  left: `${50 - 46 * f}%`,
                  top: `${50 - 46 * f}%`,
                  width: `${92 * f}%`,
                  height: `${92 * f}%`,
                  border: '1px dashed #244a73',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />
            ))}
            <div
              aria-label="You are here"
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 16,
                height: 16,
                margin: -8,
                borderRadius: '50%',
                background: '#7fd8ff',
                boxShadow: '0 0 0 6px rgba(127,216,255,.25)',
              }}
            />
            {pins.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={`${p.bank}, ${fmtDist(p.distance)} ${dirOf(p.bearing)}, ${LABELS[p.status]}`}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onClick={() => setSelected(i)}
                style={{
                  position: 'absolute',
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: i === selected ? 22 : 14,
                  height: i === selected ? 22 : 14,
                  margin: i === selected ? -11 : -7,
                  padding: 0,
                  borderRadius: '50%',
                  border: '3px solid #0a2540',
                  background: COLORS[p.status],
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              />
            ))}
            {pins[selected] && (
              <div
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  width: 240,
                  padding: 14,
                  background: '#0a2540',
                  border: '1px solid #7fd8ff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <strong style={{ fontSize: 20 }}>{pins[selected].bank}</strong>
                <span>
                  {fmtDist(pins[selected].distance)} {dirOf(pins[selected].bearing)} of you
                </span>
                <span style={{ color: COLORS[pins[selected].status] }}>
                  ● {LABELS[pins[selected].status]}
                </span>
                <span style={{ fontSize: 12, color: '#8fb0d4' }}>
                  {timeAgo(pins[selected].reportedAt)}
                </span>
                <a
                  href={
                    phase.source === 'atm-status' ? `${APP_URL}/atm/${pins[selected].id}` : APP_URL
                  }
                  style={{
                    ...btn,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    minHeight: 40,
                    fontSize: 13,
                  }}
                >
                  {phase.source === 'atm-status' ? 'Open in ATM Status ↗' : 'Open ATM Status ↗'}
                </a>
              </div>
            )}
          </>
        )}
      </div>
      {phase.kind === 'found' && (
        <span style={{ fontSize: 12, color: '#8fb0d4' }}>
          {phase.source === 'atm-status'
            ? 'Live statuses from ATM Status reports.'
            : 'ATM Status isn’t live in your city yet — these are real ATM locations from OpenStreetMap, waiting for their first report.'}
        </span>
      )}
    </div>
  )
}
