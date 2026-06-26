import { digestLines } from '../../lib/weeklyDigest'

export default function WeeklyDigestCard({ digest, onDismiss }) {
  const lines = digestLines(digest)

  return (
    <div className="mx-4 mt-3 glass-card p-5">
      <p className="font-semibold text-[var(--theme-text-on-primary)] mb-3">📋 Your week in 3 lines</p>
      <div className="space-y-1 mb-4">
        {lines.map((line, i) => (
          <p key={i} className="text-sm text-[var(--theme-text-muted)]">
            {line}
          </p>
        ))}
      </div>
      <button
        onClick={onDismiss}
        className="text-sm font-medium text-[var(--theme-accent)]"
      >
        Got it
      </button>
    </div>
  )
}
