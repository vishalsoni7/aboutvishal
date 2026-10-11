import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { redlines as copy } from '../data/profile'
import styles from './Redlines.module.css'

// Redline mode: drafting marks over the live page, all measured from the DOM when it opens.
// Elements opt in with data attributes:
//   data-redline="Name"  dashed box + tag: type spec and colour token for text, size and a
//                        width dimension for boxes
//   data-redline-frame   section gutter, top padding and the gap between its first two columns
// Nothing renders until it's switched on, so the server and first client pass match.

const TOKENS = ['--ink', '--muted', '--cyan', '--cyan-soft', '--orange', '--green', '--btn-ink']
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'A', 'BUTTON'])
const TAG_ROOM = 20 // px above a box needed to put its tag outside

type Box = { x: number; y: number; w: number; h: number }
type Mark = { name: string; spec: string; box: Box }
type Dim = { x: number; y: number; len: number; vertical?: boolean; label: string }

const px = (v: string) => Math.round(parseFloat(v) || 0)

function pageBox(el: Element): Box {
  const r = el.getBoundingClientRect()
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height }
}

// Computed colour → token name, by resolving each token through a probe element.
function tokenNames() {
  const probe = document.createElement('span')
  document.body.append(probe)
  const map = new Map<string, string>()
  for (const t of TOKENS) {
    probe.style.color = `var(${t})`
    const rgb = getComputedStyle(probe).color
    if (!map.has(rgb)) map.set(rgb, t)
  }
  probe.remove()
  return map
}

function measure() {
  const tokens = tokenNames()
  const marks: Mark[] = []
  const dims: Dim[] = []

  for (const el of document.querySelectorAll<HTMLElement>('[data-redline]')) {
    const box = pageBox(el)
    if (!box.w || !box.h) continue // hidden at this width
    const cs = getComputedStyle(el)
    // Text gets its type spec; boxes get their size and a width dimension underneath.
    if (TEXT_TAGS.has(el.tagName)) {
      const family = cs.fontFamily.split(',')[0].replace(/["']/g, '')
      const token = tokens.get(cs.color)
      let spec = `${family} ${cs.fontWeight} · ${px(cs.fontSize)}/${px(cs.lineHeight) || '—'}`
      if (token) spec += ` · ${token}`
      marks.push({ name: el.dataset.redline!, spec, box })
    } else {
      marks.push({
        name: el.dataset.redline!,
        spec: `${Math.round(box.w)} × ${Math.round(box.h)}`,
        box,
      })
      dims.push({ x: box.x, y: box.y + box.h + 10, len: box.w, label: `${Math.round(box.w)}` })
    }
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-redline-frame]')) {
    const box = pageBox(el)
    if (!box.w) continue
    const cs = getComputedStyle(el)
    const left = px(cs.paddingLeft)
    const top = px(cs.paddingTop)
    if (left) dims.push({ x: box.x, y: box.y + top / 2, len: left, label: `${left}` })
    if (top) {
      dims.push({ x: box.x + left + 16, y: box.y, len: top, vertical: true, label: `${top}` })
    }
    const [a, b] = [...el.children].map(pageBox)
    if (a && b && b.x > a.x + a.w) {
      const gap = b.x - (a.x + a.w)
      dims.push({ x: a.x + a.w, y: a.y + 24, len: gap, label: `${Math.round(gap)}` })
    }
  }

  return { marks, dims, height: document.documentElement.scrollHeight }
}

export default function Redlines({ className }: { className?: string }) {
  const [on, setOn] = useState(false)
  const [scene, setScene] = useState<ReturnType<typeof measure> | null>(null)

  // Clear the old measurements on close so reopening never flashes a stale layout.
  const toggle = (next: boolean) => {
    setOn(next)
    if (!next) setScene(null)
  }

  useEffect(() => {
    if (!on) return
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScene(measure()))
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && toggle(false)
    // Fonts, the demos and window size all move things; re-measure when the page changes size.
    const ro = new ResizeObserver(update)
    ro.observe(document.body)
    window.addEventListener('resize', update)
    window.addEventListener('keydown', onKey)
    update()
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.removeEventListener('keydown', onKey)
    }
  }, [on])

  return (
    <>
      <button
        type="button"
        className={`${styles.toggle} ${className ?? ''}`}
        aria-pressed={on}
        onClick={() => toggle(!on)}
      >
        {copy.toggle}
      </button>
      {scene &&
        createPortal(
          <>
            <div className={styles.layer} style={{ height: scene.height }} aria-hidden="true">
              {scene.marks.map((m, i) => (
                <div
                  key={`m${i}`}
                  className={styles.mark}
                  style={{ left: m.box.x, top: m.box.y, width: m.box.w, height: m.box.h }}
                >
                  <span className={`${styles.tag} ${m.box.y < TAG_ROOM ? styles.inside : ''}`}>
                    <b>{m.name}</b> {m.spec}
                  </span>
                </div>
              ))}
              {scene.dims.map((d, i) => (
                <div
                  key={`d${i}`}
                  className={`${styles.dim} ${d.vertical ? styles.vertical : ''}`}
                  style={
                    d.vertical
                      ? { left: d.x, top: d.y, height: d.len }
                      : { left: d.x, top: d.y, width: d.len }
                  }
                >
                  <span className={styles.dimLabel}>{d.label}</span>
                </div>
              ))}
            </div>
            <Ruler />
            <p className={styles.legend} aria-live="polite">
              {copy.legend} <span>{copy.close}</span>
            </p>
          </>,
          document.body,
        )}
    </>
  )
}

// Fixed px ruler along the top edge; it shares the background grid's origin, so its major ticks
// sit on the 96px lines.
function Ruler() {
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const majors = Array.from({ length: Math.ceil(width / 96) }, (_, i) => i * 96)
  return (
    <div className={styles.ruler} aria-hidden="true">
      {majors.map((x) => (
        <span key={x} className={styles.major} style={{ left: x }}>
          {x}
        </span>
      ))}
    </div>
  )
}
