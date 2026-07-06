import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Animates a number towards `target` with an ease-out curve.
 * Starts from the previous value, so updates glide instead of jumping.
 */
export function useCountUp(target, { duration = 900 } = {}) {
  const value = Number(target) || 0
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const rafRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      fromRef.current = value
      setDisplay(value)
      return
    }

    const from = fromRef.current
    if (from === value) return

    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = from + (value - from) * eased
      setDisplay(current)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = value
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      fromRef.current = value
    }
  }, [value, duration])

  return display
}
