// Small geo helpers for the nearby-ATM demo. No dependencies.
const toRad = (d: number) => (d * Math.PI) / 180

/** Great-circle distance in metres (haversine). */
export function distanceM(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Initial bearing from a to b, in degrees clockwise from north. */
export function bearingDeg(aLat: number, aLng: number, bLat: number, bLng: number) {
  const y = Math.sin(toRad(bLng - aLng)) * Math.cos(toRad(bLat))
  const x =
    Math.cos(toRad(aLat)) * Math.sin(toRad(bLat)) -
    Math.sin(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.cos(toRad(bLng - aLng))
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
export const compassDir = (bearing: number) => DIRS[Math.round(bearing / 45) % 8]

export const formatDistance = (m: number) =>
  m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`

const RADAR_STEPS = [1000, 2000, 5000, 10000, 20000, 50000, 100000]

/**
 * Smallest radar size (1 km … 100 km) holding at least `enough` of the given distances (sorted,
 * nearest first), so one far-off ATM doesn't shrink the rest into the centre. Keep `enough`
 * small: a town with 5 ATMs close by and the next 50 km away must stay on the 2 km scale
 * (with 6, Bhilwara jumped to 100 km and listed ATMs in other towns).
 */
export function radarRadius(distances: number[], enough = 3) {
  const target = distances[Math.min(enough, distances.length) - 1] ?? 0
  return RADAR_STEPS.find((r) => target <= r) ?? RADAR_STEPS[RADAR_STEPS.length - 1]
}

/** Ring label: "500 m", "1 km", "2.5 km". */
export const formatRing = (m: number) => (m < 1000 ? `${m} m` : `${m / 1000} km`)

/** Unit offset (-1…1) of a point on a radar whose edge is `radius` metres away. */
export function radarOffset(distance: number, bearing: number, radius: number) {
  const r = Math.min(distance / radius, 1)
  return { dx: Math.sin(toRad(bearing)) * r, dy: -Math.cos(toRad(bearing)) * r }
}

export function minutesSince(iso: string) {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
}

export function formatAge(minutes: number) {
  if (minutes < 60) return `${minutes} min ago`
  const h = Math.round(minutes / 60)
  return h < 48 ? `${h} h ago` : `${Math.round(h / 24)} days ago`
}
