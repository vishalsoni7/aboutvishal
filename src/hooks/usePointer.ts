import { useEffect, useLayoutEffect, useRef } from 'react'

export interface PointerPosition {
  clientX: number
  clientY: number
  pageX: number
  pageY: number
  presses: number // mouse-button presses so far; compare with the last value to spot a click
}

/**
 * Calls `onFrame` at most once per animation frame with the mouse position, or `null` when the
 * pointer leaves the window. The position lives in a closure, not React state, so moving the
 * mouse never re-renders anything. Scrolling re-reports the position (page coords change).
 * Return `true` from `onFrame` to get another frame without a new event (e.g. while easing).
 */
export function usePointer(
  onFrame: (pos: PointerPosition | null, now: number) => boolean | void,
  enabled = true,
) {
  const callback = useRef(onFrame)
  useLayoutEffect(() => {
    callback.current = onFrame
  })

  useEffect(() => {
    if (!enabled) return
    let raf = 0
    let last: { x: number; y: number } | null = null
    let presses = 0

    const flush = (now: number) => {
      raf = 0
      const more = callback.current(
        last && {
          clientX: last.x,
          clientY: last.y,
          pageX: last.x + window.scrollX,
          pageY: last.y + window.scrollY,
          presses,
        },
        now,
      )
      if (more) schedule()
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(flush)
    }
    const onMove = (e: MouseEvent) => {
      last = { x: e.clientX, y: e.clientY }
      schedule()
    }
    const onDown = (e: MouseEvent) => {
      last = { x: e.clientX, y: e.clientY }
      presses += 1
      schedule()
    }
    const onLeave = () => {
      last = null
      schedule()
    }
    const onScroll = () => {
      if (last) schedule()
    }

    const root = document.documentElement
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('blur', onLeave)
    root.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('blur', onLeave)
      root.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])
}
