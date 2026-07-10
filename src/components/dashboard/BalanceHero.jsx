import { formatSGD } from '../../lib/utils'
import { getSafeToSpend } from '../../lib/safeToSpend'
import { useCountUp } from '../../hooks/useCountUp'
import Icon from '../icons/Icon'

export default function BalanceHero({ income, totalSpent, monthLabel }) {
  const remaining = income - totalSpent
  const spentPercent = income > 0 ? Math.min((totalSpent / income) * 100, 100) : 0
  const safeToSpend = getSafeToSpend(remaining)

  const animatedRemaining = useCountUp(remaining)
  const animatedIncome = useCountUp(income)
  const animatedSpent = useCountUp(totalSpent)

  return (
    <div className="mx-4 mb-6 rounded-[28px] p-6 relative overflow-hidden glass-card-elevated reveal">
      {/* ambient glow */}
      <div
        className="absolute -top-16 -right-10 w-56 h-56 rounded-full pointer-events-none animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--theme-accent) 22%, transparent) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <div
        className="absolute -bottom-20 -left-12 w-52 h-52 rounded-full pointer-events-none opacity-60"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--theme-accent-secondary) 18%, transparent) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      <div className="relative">
        <p className="theme-muted text-[13px] uppercase tracking-widest font-medium mb-1.5">
          Remaining balance
        </p>
        <p className="text-[2.75rem] leading-none font-bold mb-4 theme-heading num">
          {formatSGD(animatedRemaining)}
        </p>

        {income > 0 && (
          remaining < 0 ? (
            <p
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full mb-5 font-medium"
              style={{
                background: 'color-mix(in srgb, var(--theme-error) 15%, transparent)',
                color: 'var(--theme-error)',
              }}
            >
              You&apos;re over budget this month
            </p>
          ) : (
            <p
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full mb-5 font-medium"
              style={{
                background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)',
                color: 'var(--theme-accent)',
              }}
            >
              <Icon name="sparkles" size={14} strokeWidth={2.2} />
              Safe to spend today: <span className="num font-semibold">{formatSGD(safeToSpend)}</span>
            </p>
          )
        )}

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="theme-hero-card rounded-2xl px-4 py-3">
            <p className="theme-muted text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Icon name="trending-up" size={12} strokeWidth={2.4} />
              Income
            </p>
            <p className="text-lg font-semibold theme-accent-text num">{formatSGD(animatedIncome)}</p>
          </div>
          <div className="theme-hero-card rounded-2xl px-4 py-3">
            <p className="theme-muted text-[11px] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Icon name="wallet" size={12} strokeWidth={2.4} />
              Spent
            </p>
            <p className="text-lg font-semibold theme-heading num">{formatSGD(animatedSpent)}</p>
          </div>
        </div>

        {income > 0 && (
          <div>
            <div className="flex justify-between text-xs theme-muted mb-1.5">
              <span>Budget used</span>
              <span className="num font-medium">{Math.round(spentPercent)}%</span>
            </div>
            <div className="h-2.5 theme-progress-track rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full animate-bar-fill ${
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
