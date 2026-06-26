import { formatSGD, formatMonthLabel } from '../../lib/utils'

export default function MonthEndModal({ monthKey, income, totalSpent, streak, onStartNewMonth }) {
  const saved = income - totalSpent
  const underBudget = saved >= 0
  const monthLabel = formatMonthLabel(monthKey)

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-6 bg-black/70">
      <div className="w-full max-w-sm glass-card p-8 text-center">
        <p className="text-2xl font-bold text-[var(--theme-text-on-primary)] mb-6">
          {monthLabel.split(' ')[0]} is done ✦
        </p>

        <p className="text-[var(--theme-text-muted)] mb-1">You spent</p>
        <p className="text-3xl font-bold text-[var(--theme-text-on-primary)] mb-1">
          {formatSGD(totalSpent)}
        </p>
        <p className="text-sm text-[var(--theme-text-muted)] mb-6">of {formatSGD(income)}</p>

        {underBudget ? (
          <p className="text-lg text-[var(--theme-accent)] font-semibold mb-4">
            {formatSGD(saved)} saved 🎉
          </p>
        ) : (
          <p className="text-lg text-[var(--theme-text-muted)] mb-4">
            {monthLabel.split(' ')[0]} was a big one. A fresh start awaits.
          </p>
        )}

        {streak > 0 && (
          <p className="text-sm text-[var(--theme-text-on-primary)] mb-6">
            🔥 {streak} months on track
          </p>
        )}

        <button
          onClick={onStartNewMonth}
          className="w-full py-3.5 rounded-2xl font-semibold text-[var(--theme-primary)]"
          style={{ background: 'var(--theme-accent)' }}
        >
          Start new month
        </button>
      </div>
    </div>
  )
}
