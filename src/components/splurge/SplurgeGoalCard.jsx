import { getMonthlyRecommendation, formatTargetMonth } from '../../lib/splurgeRecommendations'
import { formatSGD } from '../../lib/utils'
import Icon from '../icons/Icon'
import Confetti from './Confetti'

export default function SplurgeGoalCard({ goal, onAddContribution, onEdit, onDelete, index = 0 }) {
  const percent = Math.min((goal.saved / goal.target_amount) * 100, 100)
  const completed = goal.saved >= goal.target_amount
  const rec = getMonthlyRecommendation(
    Number(goal.target_amount),
    Number(goal.saved),
    goal.target_date
  )

  return (
    <div className="glass-card p-5 relative overflow-hidden reveal" style={{ '--delay': `${0.08 + index * 0.07}s` }}>
      {completed && <Confetti />}

      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold font-display theme-heading">
            {goal.emoji} {goal.name}
          </h3>
          {goal.description && (
            <p className="text-sm theme-muted mt-0.5">{goal.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="theme-muted hover:text-[var(--theme-error)] p-1.5 rounded-lg transition-colors pressable"
          aria-label="Delete goal"
        >
          <Icon name="x" size={16} />
        </button>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <p className="theme-heading text-sm num">
          <span className="font-bold">{formatSGD(goal.saved)}</span>
          <span className="theme-muted"> of {formatSGD(goal.target_amount)}</span>
        </p>
        <span className="text-xs font-semibold num theme-accent-text">{Math.round(percent)}%</span>
      </div>

      <div className="h-2.5 theme-progress-track rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full animate-bar-fill"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, var(--theme-accent), var(--theme-accent-secondary))',
            animationDelay: `${0.25 + index * 0.1}s`,
          }}
        />
      </div>
      <p className="text-xs theme-muted mb-3">Target: {formatTargetMonth(goal.target_date)}</p>

      {rec.remaining > 0 && (
        <div className="rounded-2xl p-3 mb-4 text-sm theme-muted flex items-start gap-2" style={{ background: 'var(--theme-surface)' }}>
          <Icon name="lightbulb" size={16} className="theme-accent-text flex-shrink-0 mt-0.5" />
          <span>
            Top up <span className="font-semibold theme-accent-text num">{formatSGD(rec.recommended)}/month</span> to
            hit your goal on time
          </span>
        </div>
      )}

      {completed && (
        <div
          className="rounded-2xl p-3 mb-4 text-sm font-medium flex items-center gap-2"
          style={{
            background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)',
            color: 'var(--theme-accent)',
          }}
        >
          <Icon name="trophy" size={16} />
          Goal reached! You did it!
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAddContribution(goal)}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium pressable flex items-center justify-center gap-1.5"
          style={{ background: 'color-mix(in srgb, var(--theme-accent) 18%, transparent)', color: 'var(--theme-accent)' }}
        >
          <Icon name="plus" size={15} strokeWidth={2.4} />
          Add Contribution
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="px-4 py-2.5 theme-btn-secondary text-sm font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  )
}
