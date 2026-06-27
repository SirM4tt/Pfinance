import { formatSGD } from '../../lib/utils'
import { getSafeToSpend } from '../../lib/safeToSpend'

export default function BalanceHero({ income, totalSpent, monthLabel }) {
  const remaining = income - totalSpent
  const spentPercent = income > 0 ? Math.min((totalSpent / income) * 100, 100) : 0
  const safeToSpend = getSafeToSpend(remaining)

  return (
    <div className="mx-4 mb-6 rounded-3xl p-6 relative overflow-hidden theme-hero-card">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--theme-accent) 35%, transparent) 0%, transparent 70%)' }}
      />

      <div className="relative">
        <p className="theme-muted text-sm mb-1">{monthLabel}</p>
        <p className="theme-muted text-sm mb-1">Remaining balance</p>
        <p className="text-4xl font-bold mb-3 theme-heading">
          {formatSGD(remaining)}
        </p>

        {income > 0 && (
          remaining < 0 ? (
            <p className="inline-block theme-pill text-sm px-3 py-1 rounded-full mb-4">
              You&apos;re over budget this month
            </p>
          ) : (
            <p className="inline-block theme-pill text-sm px-3 py-1 rounded-full mb-4">
              ✦ Safe to spend today: {formatSGD(safeToSpend)}
            </p>
          )
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="theme-muted text-xs uppercase tracking-wide">Income</p>
            <p className="text-lg font-semibold theme-accent-text">{formatSGD(income)}</p>
          </div>
          <div>
            <p className="theme-muted text-xs uppercase tracking-wide">Spent</p>
            <p className="text-lg font-semibold theme-heading">{formatSGD(totalSpent)}</p>
          </div>
        </div>

        {income > 0 && (
          <div>
            <div className="flex justify-between text-xs theme-muted mb-1">
              <span>Budget used</span>
              <span>{Math.round(spentPercent)}%</span>
            </div>
            <div className="h-2 theme-progress-track rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${
                  spentPercent >= 90 ? 'theme-progress-warning' : 'theme-progress-fill'
                }`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
