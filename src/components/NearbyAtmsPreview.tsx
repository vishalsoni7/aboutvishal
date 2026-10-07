/**
 * NearbyAtmsPreview — the "try it" demo in the ATM Status section.
 *
 * idle → locating → loading → found | empty | error
 * denied / no geolocation / "explore the pilot" → pilot (sample Bhilwara pins)
 *
 * Coordinates are passed straight to findNearbyAtms and never kept in state, logged or stored.
 */
import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { atmDemo as copy, ATM_APP_URL, pilotPins } from '../data/projects'
import {
  findNearbyAtms,
  RADIUS_M,
  type AtmSource,
  type AtmStatus,
  type NearbyAtm,
} from '../lib/atmSources'
import { compassDir, formatAge, formatDistance, minutesSince, radarOffset } from '../lib/geo'
import { externalProps } from '../lib/links'
import styles from './NearbyAtmsPreview.module.css'

type Phase =
  | { kind: 'idle' }
  | { kind: 'locating' }
  | { kind: 'loading' }
  | { kind: 'found'; atms: NearbyAtm[]; source: AtmSource }
  | { kind: 'pilot'; caption: string }
  | { kind: 'empty' }
  | { kind: 'error'; reason: keyof typeof copy.errors }

// What the map, selected card and nearest cards need, whatever the source.
interface MapItem {
  id: string
  bank: string
  status: AtmStatus
  left: string
  top: string
  where: string // selected card: "430 m SW of you" / "Station Road, Bhilwara"
  short: string // nearest card: "430 m SW" / "Station Road"
  when: string
}

const PILOT_STATUS: AtmStatus[] = ['working', 'not_working', 'unknown']
const STATUS_CLASS: Record<AtmStatus, string> = {
  working: styles.working,
  not_working: styles.notWorking,
  unknown: styles.unknown,
}

function reportLine(status: AtmStatus, minutes: number | null) {
  if (status === 'unknown' || minutes === null) return copy.noReports
  return `Reported ${status === 'working' ? 'working' : 'not working'} ${formatAge(minutes)}`
}

function toMapItems(phase: Phase): MapItem[] {
  if (phase.kind === 'found') {
    return phase.atms.map((a) => {
      const { dx, dy } = radarOffset(a.distance, a.bearing, RADIUS_M)
      const short = `${formatDistance(a.distance)} ${compassDir(a.bearing)}`
      return {
        id: a.id,
        bank: a.bank,
        status: a.status,
        left: `clamp(14px, calc(50% + var(--radar-r) * ${dx.toFixed(4)}), calc(100% - 14px))`,
        top: `clamp(14px, calc(50% + var(--radar-r) * ${dy.toFixed(4)}), calc(100% - 14px))`,
        where: `${short} of you`,
        short,
        when: reportLine(a.status, a.reportedAt ? minutesSince(a.reportedAt) : null),
      }
    })
  }
  if (phase.kind === 'pilot') {
    return pilotPins.map((p, i) => {
      const status = PILOT_STATUS[p.st]
      return {
        id: `pilot-${i}`,
        bank: p.bank,
        status,
        left: `${p.x}%`,
        top: `${p.y}%`,
        where: `${p.name}, Bhilwara`,
        short: p.name,
        when: reportLine(status, 10 + ((p.x * 7) % 50)),
      }
    })
  }
  return []
}

function captionFor(phase: Phase) {
  if (phase.kind === 'found') return phase.source === 'osm' ? copy.captions.osm : copy.captions.live
  if (phase.kind === 'pilot') return phase.caption
  return copy.captions.idle
}

export default function NearbyAtmsPreview() {
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  const [selected, setSelected] = useState(0)
  // Ignore lookups that finish after the visitor pressed START OVER or retried.
  const request = useRef(0)

  const go = (next: Phase) => {
    setSelected(0)
    setPhase(next)
  }

  const showPilot = (caption: string = copy.captions.pilot) => {
    request.current++
    go({ kind: 'pilot', caption })
  }

  const reset = () => {
    request.current++
    go({ kind: 'idle' })
  }

  const locate = () => {
    if (!('geolocation' in navigator)) return showPilot(copy.captions.unsupported)
    const id = ++request.current
    setPhase({ kind: 'locating' })
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        if (id !== request.current) return
        setPhase({ kind: 'loading' })
        try {
          const { atms, source } = await findNearbyAtms(coords.latitude, coords.longitude)
          if (id !== request.current) return
          go(atms.length ? { kind: 'found', atms, source } : { kind: 'empty' })
        } catch {
          if (id === request.current) go({ kind: 'error', reason: 'lookup' })
        }
      },
      (err) => {
        if (id !== request.current) return
        if (err.code === err.PERMISSION_DENIED) showPilot(copy.captions.denied)
        else go({ kind: 'error', reason: err.code === err.TIMEOUT ? 'timeout' : 'unavailable' })
      },
      { timeout: 10000, maximumAge: 60000 },
    )
  }

  const items = useMemo(() => toMapItems(phase), [phase])
  const sel = items[Math.min(selected, items.length - 1)]
  const nearest = items.slice(0, 4)
  const isNear = phase.kind === 'found'
  const reportUrl = ATM_APP_URL

  return (
    <div className={styles.demo}>
      <div className={styles.panel}>
        <div className={styles.roadH} aria-hidden="true" />
        <div className={styles.roadV} aria-hidden="true" />

        {phase.kind === 'idle' && (
          <div className={styles.veil}>
            <div className={styles.card}>
              <p className="label label-accent">{copy.idle.label}</p>
              <h3 className={styles.cardTitle}>{copy.idle.title}</h3>
              <p className={styles.cardText}>{copy.idle.text}</p>
              <button
                type="button"
                className={`btn btn-primary ${styles.findBtn}`}
                onClick={locate}
              >
                {copy.idle.find}
              </button>
              <button type="button" className={styles.textBtn} onClick={() => showPilot()}>
                {copy.idle.pilot}
              </button>
            </div>
          </div>
        )}

        {(phase.kind === 'locating' || phase.kind === 'loading') && (
          <div className={styles.center} role="status">
            <div className={styles.pingBox} aria-hidden="true">
              <span className={styles.ping} />
              <span className={`${styles.ping} ${styles.pingLate}`} />
              <span className={styles.pingDot} />
            </div>
            <p className={styles.statusText}>
              {phase.kind === 'locating' ? copy.locating : copy.loading}
            </p>
          </div>
        )}

        {(phase.kind === 'empty' || phase.kind === 'error') && (
          <div className={styles.center}>
            <p role="alert" className={styles.message}>
              {phase.kind === 'empty' ? copy.empty : copy.errors[phase.reason]}
            </p>
            <button type="button" className={`btn btn-primary ${styles.findBtn}`} onClick={locate}>
              {copy.retry}
            </button>
            <button type="button" className={styles.textBtn} onClick={() => showPilot()}>
              {copy.idle.pilot}
            </button>
          </div>
        )}

        {sel && (
          <>
            {isNear && (
              <>
                {[1, 0.5].map((f, i) => (
                  <div
                    key={f}
                    className={styles.ring}
                    style={{ '--f': f } as CSSProperties}
                    aria-hidden="true"
                  >
                    <span className={styles.ringLabel}>{copy.ringLabels[1 - i]}</span>
                  </div>
                ))}
                <span className={`${styles.ping} ${styles.youPing}`} aria-hidden="true" />
                <span className={styles.you} role="img" aria-label={copy.you} />
              </>
            )}

            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.pin} ${STATUS_CLASS[item.status]} ${item === sel ? styles.pinActive : ''}`}
                style={{ left: item.left, top: item.top }}
                aria-label={`${item.bank}, ${item.short}, ${copy.status[item.status]}`}
                aria-pressed={item === sel}
                onMouseEnter={() => setSelected(i)}
                onFocus={() => setSelected(i)}
                onClick={() => setSelected(i)}
              >
                <span className={styles.pinDot} />
              </button>
            ))}

            <div className={styles.area}>
              <span className={styles.areaTag}>{isNear ? copy.nearTag : copy.pilotTag}</span>
              <span className={styles.areaLabel}>{isNear ? copy.nearLabel : copy.pilotLabel}</span>
            </div>

            <div className={styles.selected} aria-live="polite">
              <span className={styles.areaTag}>{isNear ? copy.selected : copy.selectedSample}</span>
              <span className={styles.selBank}>{sel.bank}</span>
              <span className={styles.selWhere}>{sel.where}</span>
              <span className={`${styles.statusLine} ${STATUS_CLASS[sel.status]}`}>
                <span className={styles.dot} />
                {copy.status[sel.status]}
              </span>
              <span className={styles.selWhen}>{sel.when}</span>
              <a
                href={reportUrl}
                className={`btn btn-primary ${styles.reportBtn}`}
                {...externalProps(reportUrl)}
              >
                {copy.report}
              </a>
            </div>

            <button type="button" className={`btn btn-ghost ${styles.startOver}`} onClick={reset}>
              {copy.startOver}
            </button>
          </>
        )}
      </div>

      <div className={styles.caption}>
        <span>{captionFor(phase)}</span>
        <span className={styles.legend}>
          {(['working', 'not_working', 'unknown'] as const).map((s) => (
            <span key={s} className={STATUS_CLASS[s]}>
              ● {copy.legend[s]}
            </span>
          ))}
        </span>
      </div>

      {sel && (
        <ul className={styles.nearest}>
          {nearest.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.near} ${item === sel ? styles.nearActive : ''}`}
                aria-pressed={item === sel}
                onClick={() => setSelected(i)}
              >
                <span className={styles.nearShort}>{item.short}</span>
                <span className={styles.nearBank}>{item.bank}</span>
                <span
                  className={`${styles.statusLine} ${styles.small} ${STATUS_CLASS[item.status]}`}
                >
                  <span className={styles.dot} />
                  {copy.status[item.status]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
