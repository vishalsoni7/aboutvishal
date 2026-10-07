/**
 * Animates the tab icon: the reticle's four ticks rotate slowly and the centre dot breathes.
 * Browsers don't play animated favicon files (only Firefox does), so this redraws the icon on a
 * 64px canvas a few times a second and swaps it in as a data URL. Works in Chrome, Edge and
 * Firefox; Safari ignores live favicon changes and keeps the static /favicon.svg.
 * Stays still under reduced motion and pauses while the tab is hidden.
 */
const SIZE = 64
const FPS = 12
const TURN_MS = 9000 // one full turn of the ticks
const PULSE_MS = 2400 // one breath of the centre dot
const NAVY = '#0a2540'
const CYAN = '#7fd8ff'

export function startAnimatedFavicon() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // One icon link we control; the static ones stay in index.html for browsers without JS.
  document.querySelectorAll('link[rel="icon"]').forEach((l) => l.remove())
  const link = document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'
  document.head.appendChild(link)

  const c = SIZE / 2
  const draw = (now: number) => {
    ctx.clearRect(0, 0, SIZE, SIZE)
    ctx.fillStyle = NAVY
    ctx.beginPath()
    ctx.roundRect(0, 0, SIZE, SIZE, 12)
    ctx.fill()

    ctx.strokeStyle = CYAN
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.arc(c, c, 15, 0, Math.PI * 2)
    ctx.stroke()

    // Four ticks, rotating together
    const turn = ((now % TURN_MS) / TURN_MS) * Math.PI * 2
    ctx.beginPath()
    for (let i = 0; i < 4; i++) {
      const a = turn + (i * Math.PI) / 2
      ctx.moveTo(c + Math.cos(a) * 15, c + Math.sin(a) * 15)
      ctx.lineTo(c + Math.cos(a) * 26, c + Math.sin(a) * 26)
    }
    ctx.stroke()

    // Centre dot breathes between r 3 and 5.5
    const breath = (1 - Math.cos(((now % PULSE_MS) / PULSE_MS) * Math.PI * 2)) / 2
    ctx.fillStyle = CYAN
    ctx.beginPath()
    ctx.arc(c, c, 3 + breath * 2.5, 0, Math.PI * 2)
    ctx.fill()

    link.href = canvas.toDataURL('image/png')
  }

  let timer = 0
  const start = () => {
    if (!timer) timer = window.setInterval(() => draw(performance.now()), 1000 / FPS)
  }
  const stop = () => {
    window.clearInterval(timer)
    timer = 0
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()))
  draw(performance.now())
  if (!document.hidden) start()
}
