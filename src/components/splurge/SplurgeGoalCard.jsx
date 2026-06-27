import { getMonthlyRecommendation, formatTargetMonth } from '../../lib/splurgeRecommendations'
import { formatSGD } from '../../lib/utils'

export default function SplurgeGoalCard({ goal, onAddContribution, onEdit, onDelete }) {
  const percent = Math.min((goal.saved / goal.target_amount) * 100, 100)
  const rec = getMonthlyRecommendation(
    Number(goal.target_amount),
    Number(goal.saved),
    goal.target_date
  )

  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold theme-heading">
            {goal.emoji} {goal.name}
          </h3>
          {goal.description && (
            <p className="text-sm theme-muted mt-0.5">{goal.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="theme-muted hover:text-[var(--theme-error)] text-sm px-2 transition-colors"
        >
          ✕
        </button>
      </div>

      <p className="theme-heading mb-2 text-sm">
        {formatSGD(goal.saved)} of {formatSGD(goal.target_amount)}
      </p>

      <div className="h-2.5 theme-progress-track rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full theme-progress-fill transition-all"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, var(--theme-accent), var(--theme-accent-secondary))',
          }}
        />
      </div>
      <p className="text-xs theme-muted mb-3">{Math.round(percent)}% · Target: {formatTargetMonth(goal.target_date)}</p>

      {rec.remaining > 0 && (
        <div className="glass-card p-3 mb-4 text-sm theme-muted">
          💡 Top up <span className="font-semibold theme-accent-text">{formatSGD(rec.recommended)}/month</span>
          <br />
          <span className="theme-muted">to hit your goal on time</span>
        </div>
      )}

      {goal.saved >= goal.target_amount && (
        <div className="glass-card p-3 mb-4 text-sm theme-accent-text font-medium">
          🎉 Goal reached! You did it!
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAddContribution(goal)}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors theme-btn-primary"
          style={{ background: 'color-mix(in srgb, var(--theme-accent) 20%, transparent)', color: 'var(--theme-accent)' }}
        >
          + Add Contribution
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
