import { useEffect, useRef, useState, type MouseEvent } from 'react'
import contributions from 'virtual:github-contributions'
import { activity } from '../data/profile'
import { externalProps } from '../lib/links'
import styles from './ContributionStrip.module.css'

// GitHub contribution calendar drawn as a blueprint trace: one column per week, one row per
// weekday, cyan fill by activity level. Data comes from the build (plugins/githubContributions.ts).
const CELL = 11
const STEP = 14
const LEFT = 36 // weekday labels
const TOP = 18 // month labels
const DAY_MS = 86_400_000

const parse = (iso: string) => Date.parse(`${iso}T00:00:00Z`)
const label = (ms: number) => {
  const d = new Date(ms)
  return `${String(d.getUTCDate()).padStart(2, '0')} ${activity.months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export default function ContributionStrip() {
  const scroller = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  // On narrow screens the graph scrolls sideways; start at the most recent weeks.
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  if (!contributions) return null
  const { total, start, asOf, days } = contributions
  const t0 = parse(start)
  const offset = new Date(t0).getUTCDay() // the first column may start mid-week
  const cols = Math.ceil((offset + days.length) / 7)
  const width = LEFT + cols * STEP
  const height = TOP + 7 * STEP

  // A month label goes on the first column whose top cell is in a new month, if there's room.
  const months: Array<{ col: number; text: string }> = []
  for (let col = 0, last = -1; col < cols; col++) {
    const month = new Date(t0 + (col * 7 - offset) * DAY_MS).getUTCMonth()
    if (month === last) continue
    last = month
    const prev = months[months.length - 1]
    if (col > cols - 3) break
    if (prev && col - prev.col < 3) months.pop()
    months.push({ col, text: activity.months[month] })
  }

  const onOver = (e: MouseEvent<SVGSVGElement>) => {
    const i = (e.target as SVGElement).dataset?.i
    setHover(i === undefined ? null : Number(i))
  }

  const range = `${label(t0)} – ${label(t0 + (days.length - 1) * DAY_MS)}`

  return (
    <div className={styles.block}>
      <div className={styles.head}>
        <p className="label">{activity.title}</p>
        <a
          href={activity.profile.href}
          className={styles.profile}
          {...externalProps(activity.profile.href)}
        >
          {activity.profile.label}
        </a>
      </div>
      <h3 className={styles.heading}>{activity.heading(total)}</h3>

      <div
        ref={scroller}
        className={styles.scroller}
        tabIndex={0}
        role="region"
        aria-label={`${activity.heading(total)}, ${range}`}
      >
        <svg
          className={styles.graph}
          viewBox={`0 0 ${width} ${height}`}
          style={{ minWidth: width * 1.25 }} // keeps cells and labels legible on phones
          role="img"
          aria-label={`Contribution graph, ${range}`}
          onMouseOver={onOver}
          onMouseLeave={() => setHover(null)}
        >
          {months.map((m) => (
            <text key={m.col} x={LEFT + m.col * STEP} y={9} className={styles.axis}>
              {m.text}
            </text>
          ))}
          {activity.weekdays.map((d, row) =>
            d ? (
              <text key={d} x={0} y={TOP + row * STEP + 8.5} className={styles.axis}>
                {d}
              </text>
            ) : null,
          )}
          {days.map(([, level], i) => {
            const slot = i + offset
            return (
              <rect
                key={i}
                data-i={i}
                x={LEFT + Math.floor(slot / 7) * STEP + 0.5}
                y={TOP + (slot % 7) * STEP + 0.5}
                width={CELL - 1}
                height={CELL - 1}
                className={`${styles.cell} ${styles[`l${level}`]} ${hover === i ? styles.on : ''}`}
              />
            )
          })}
        </svg>
      </div>

      <div className={styles.foot}>
        <p className={styles.readout} aria-hidden="true">
          {hover === null
            ? activity.idle
            : activity.cell(days[hover][0], label(t0 + hover * DAY_MS))}
        </p>
        <div className={styles.legend} aria-hidden="true">
          <span>{activity.less}</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width={CELL} height={CELL} className={styles.swatch}>
              <rect
                x={0.5}
                y={0.5}
                width={CELL - 1}
                height={CELL - 1}
                className={`${styles.cell} ${styles[`l${l}`]}`}
              />
            </svg>
          ))}
          <span>{activity.more}</span>
          <span className={styles.asOf}>{activity.asOf(label(parse(asOf)))}</span>
        </div>
      </div>
    </div>
  )
}
