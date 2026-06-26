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
          <h3 className="text-lg font-semibold text-white">
            {goal.emoji} {goal.name}
          </h3>
          {goal.description && (
            <p className="text-sm text-white/50 mt-0.5">{goal.description}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-white/30 hover:text-accent-red text-sm px-2"
        >
          ✕
        </button>
      </div>

      <p className="text-white/80 mb-2">
        {formatSGD(goal.saved)} of {formatSGD(goal.target_amount)}
      </p>

      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-blue transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-white/50 mb-3">{Math.round(percent)}% · Target: {formatTargetMonth(goal.target_date)}</p>

      {rec.remaining > 0 && (
        <div className="glass-card p-3 mb-4 text-sm text-white/70">
          💡 Top up <span className="font-semibold text-accent-green">{formatSGD(rec.recommended)}/month</span>
          <br />
          <span className="text-white/50">to hit your goal on time</span>
        </div>
      )}

      {goal.saved >= goal.target_amount && (
        <div className="glass-card p-3 mb-4 text-sm text-accent-green font-medium">
          🎉 Goal reached! You did it!
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onAddContribution(goal)}
          className="flex-1 py-2.5 bg-accent-green/20 text-accent-green rounded-xl text-sm font-medium hover:bg-accent-green/30 transition-colors"
        >
          + Add Contribution
        </button>
        <button
          onClick={() => onEdit(goal)}
          className="px-4 py-2.5 bg-white/10 text-white/70 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  )
}
