import { formatSGD, formatMonthLabel } from '../../lib/utils'
import Icon from '../icons/Icon'
import Confetti from '../splurge/Confetti'

export default function MonthEndModal({ monthKey, income, totalSpent, streak, onStartNewMonth }) {
  const saved = income - totalSpent
  const underBudget = saved >= 0
  const monthLabel = formatMonthLabel(monthKey)

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center px-6 animate-fade-in"
      style={{ background: 'var(--theme-overlay)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
    >
      <div className="w-full max-w-sm glass-card-elevated p-8 text-center relative overflow-hidden reveal-scale">
        {underBudget && <Confetti />}

        <p className="text-2xl font-bold font-display text-[var(--theme-text-on-primary)] mb-6">
          {monthLabel.split(' ')[0]} is done ✦
        </p>

        <p className="text-[var(--theme-text-muted)] mb-1">You spent</p>
        <p className="text-3xl font-bold text-[var(--theme-text-on-primary)] mb-1 num">
          {formatSGD(totalSpent)}
        </p>
        <p className="text-sm text-[var(--theme-text-muted)] mb-6 num">of {formatSGD(income)}</p>

        {underBudget ? (
          <p className="text-lg text-[var(--theme-accent)] font-semibold mb-4 num">
            {formatSGD(saved)} saved 🎉
          </p>
        ) : (
          <p className="text-lg text-[var(--theme-text-muted)] mb-4">
            {monthLabel.split(' ')[0]} was a big one. A fresh start awaits.
          </p>
        )}

        {streak > 0 && (
          <p className="text-sm text-[var(--theme-text-on-primary)] mb-6 flex items-center justify-center gap-1.5">
            <span className="animate-flame" style={{ color: '#fb923c' }}>
              <Icon name="flame" size={15} strokeWidth={2.2} />
            </span>
            {streak} months on track
          </p>
        )}

        <button onClick={onStartNewMonth} className="w-full py-3.5 rounded-2xl theme-btn-gradient">
          Start new month
        </button>
      </div>
    </div>
  )
}
