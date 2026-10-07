import { useRef } from 'react'
import { crosshair as copy } from '../data/profile'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePointer } from '../hooks/usePointer'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import styles from './Crosshair.module.css'

const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0')
const lerp = (a: number, b: number, k: number) => a + (b - a) * k

const RETICLE = 34 // px, the free-moving reticle's size
const LOCK_PAD = 6 // px of air around a locked-on element
const READOUT_GAP = 14
const TARGETS = 'a[href], button:not([disabled]), [role="button"]'

// The thing under the pointer that the reticle should frame, if any.
function targetAt(x: number, y: number) {
  const el = document.elementFromPoint(x, y)?.closest<HTMLElement>(TARGETS)
  return el && el.getAttribute('aria-disabled') !== 'true' ? el : null
}

/**
 * Blueprint crosshair: full-page lines that ease after the pointer, a reticle of drafting
 * brackets that spins as it moves, and a counting coordinate readout. Over a link or button the
 * brackets glide out to frame it and the readout shows its size. Mouse + desktop width only, off
 * under reduced motion. Everything is written straight to the DOM inside rAF (see usePointer).
 */
export default function Crosshair() {
  const reduced = usePrefersReducedMotion()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine) and (min-width: 900px)')
  const enabled = finePointer && !reduced

  const root = useRef<HTMLDivElement>(null)
  const lineX = useRef<HTMLDivElement>(null)
  const lineY = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const readout = useRef<HTMLDivElement>(null)
  // Animation state between frames (never React state, so nothing re-renders).
  const m = useRef({
    live: false,
    x: 0,
    y: 0,
    rx: 0,
    ry: 0,
    bx: 0,
    by: 0,
    bw: 0,
    bh: 0,
    angle: 0,
    pulse: 0,
    presses: 0,
  })

  usePointer((pos) => {
    const els = [root.current, lineX.current, lineY.current, frame.current, readout.current]
    if (!pos || els.some((e) => !e)) {
      if (root.current) root.current.dataset.visible = 'false'
      m.current.live = false
      return false
    }
    const [rootEl, lx, ly, box, label] = els as HTMLDivElement[]
    const s = m.current
    const { clientX: tx, clientY: ty } = pos

    if (!s.live) {
      // First frame after entering: start where the pointer is instead of flying in from 0,0.
      Object.assign(s, { live: true, x: tx, y: ty, rx: pos.pageX, ry: pos.pageY })
      Object.assign(s, { bx: tx - RETICLE / 2, by: ty - RETICLE / 2, bw: RETICLE, bh: RETICLE })
    }
    if (pos.presses !== s.presses) {
      s.presses = pos.presses
      s.pulse = 1
    }

    // Lines and reticle ease towards the pointer; the readout counts towards the page coords.
    const px = s.x
    const py = s.y
    s.x = lerp(s.x, tx, 0.16)
    s.y = lerp(s.y, ty, 0.16)
    s.rx = lerp(s.rx, pos.pageX, 0.2)
    s.ry = lerp(s.ry, pos.pageY, 0.2)
    s.pulse *= 0.86

    const target = targetAt(tx, ty)
    let goal: { x: number; y: number; w: number; h: number }
    if (target) {
      const r = target.getBoundingClientRect()
      const squeeze = s.pulse * 5
      goal = {
        x: r.left - LOCK_PAD + squeeze,
        y: r.top - LOCK_PAD + squeeze,
        w: r.width + LOCK_PAD * 2 - squeeze * 2,
        h: r.height + LOCK_PAD * 2 - squeeze * 2,
      }
      // Square up at once. Easing the spin back while the frame stretches to a wide button turns it
      // sideways mid-way, and it can freeze there if the size settles before the angle does.
      s.angle = 0
    } else {
      const size = RETICLE * (1 + s.pulse * 0.6)
      goal = { x: s.x - size / 2, y: s.y - size / 2, w: size, h: size }
      s.angle = (s.angle + 0.6 + Math.hypot(s.x - px, s.y - py) * 1.4) % 360 // spins faster on the move
    }
    s.bx = lerp(s.bx, goal.x, 0.3)
    s.by = lerp(s.by, goal.y, 0.3)
    s.bw = lerp(s.bw, goal.w, 0.3)
    s.bh = lerp(s.bh, goal.h, 0.3)

    lx.style.transform = `translate3d(0, ${s.y}px, 0)`
    ly.style.transform = `translate3d(${s.x}px, 0, 0)`
    box.style.width = `${s.bw}px`
    box.style.height = `${s.bh}px`
    box.style.transform = `translate3d(${s.bx}px, ${s.by}px, 0) rotate(${s.angle}deg)`

    rootEl.dataset.locked = target ? 'true' : 'false'
    if (target) {
      const r = target.getBoundingClientRect()
      const kind = target.tagName === 'A' ? copy.link : copy.button
      label.textContent = `${copy.lock} · ${kind} · W ${Math.round(r.width)} × H ${Math.round(r.height)}`
    } else {
      label.textContent = `X ${pad(s.rx)} · Y ${pad(s.ry)}`
    }
    // Free: beside the crossing. Locked: off the frame's bottom-right corner. Flip near edges.
    const ax = target ? s.bx + s.bw - READOUT_GAP : s.x
    const ay = target ? s.by + s.bh - READOUT_GAP : s.y
    const left =
      ax + READOUT_GAP + label.offsetWidth > window.innerWidth
        ? ax - READOUT_GAP - label.offsetWidth
        : ax + READOUT_GAP
    const top =
      ay + READOUT_GAP + label.offsetHeight > window.innerHeight
        ? ay - READOUT_GAP - label.offsetHeight
        : ay + READOUT_GAP
    label.style.transform = `translate3d(${left}px, ${top}px, 0)`
    rootEl.dataset.visible = 'true'

    // Keep animating while the reticle spins (free) or anything is still settling (locked).
    const settling =
      Math.abs(s.x - tx) + Math.abs(s.y - ty) > 0.3 ||
      Math.abs(s.bw - goal.w) + Math.abs(s.bx - goal.x) > 0.3 ||
      s.pulse > 0.01
    return !target || settling
  }, enabled)

  if (!enabled) return null
  return (
    <div ref={root} className={styles.root} data-visible="false" aria-hidden="true">
      <div ref={lineX} className={styles.lineX} />
      <div ref={lineY} className={styles.lineY} />
      <div ref={frame} className={styles.frame}>
        <span className={styles.ring} />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div ref={readout} className={styles.readout} />
    </div>
  )
}
