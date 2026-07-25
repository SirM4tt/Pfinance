import { useEffect, useState } from 'react'
import { applyPwaUpdate, onPwaUpdateAvailable } from '../../lib/registerPwa'

const AUTO_REFRESH_MS = 5000

export default function PwaUpdatePrompt() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    return onPwaUpdateAvailable(() => setVisible(true))
  }, [])

  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      applyPwaUpdate()
    }, AUTO_REFRESH_MS)

    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-24 left-4 right-4 z-[250] mx-auto max-w-lg rounded-2xl p-4 shadow-lg glass-card"
      role="alert"
    >
      <p className="text-sm font-semibold theme-heading mb-1">Update available</p>
      <p className="text-xs theme-muted mb-3">
        A new version of Pfinance is ready. Refreshing automatically in a few seconds.
      </p>
      <button
        type="button"
        onClick={() => applyPwaUpdate()}
        className="w-full py-2.5 theme-btn-primary text-sm"
      >
        Refresh now
      </button>
    </div>
  )
}
