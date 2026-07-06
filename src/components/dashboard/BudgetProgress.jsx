import { formatSGD } from '../../lib/utils'
import { getBudgetMessage, getBudgetBarColor, getBudgetTextColor } from '../../lib/budgetMessages'
import { CategoryChip } from '../icons/Icon'

export default function BudgetProgress({ categories, expenses, limit = 3 }) {
  const spentByCategory = {}
  for (const exp of expenses) {
    const catId = exp.category_id
    if (!catId) continue
    spentByCategory[catId] = (spentByCategory[catId] || 0) + Number(exp.amount)
  }

  const withBudget = categories
    .filter((cat) => cat.budget_limit != null && cat.budget_limit > 0)
    .map((cat) => {
      const spent = spentByCategory[cat.id] || 0
      const budgetLimit = Number(cat.budget_limit)
      const percent = (spent / budgetLimit) * 100
      const message = getBudgetMessage(spent, budgetLimit, Number(cat.last_month_spent) || 0)
      return { ...cat, spent, limit: budgetLimit, percent, message }
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, limit)

  if (!withBudget.length) {
    return (
      <div className="mx-4 mt-4 glass-card p-6 reveal" style={{ '--delay': '0.16s' }}>
        <h2 className="text-lg font-semibold font-display theme-heading mb-2">Budget progress</h2>
        <p className="text-sm theme-muted">Set category budgets in the Budget tab</p>
      </div>
    )
  }

  return (
    <div className="mx-4 mt-4 glass-card p-6 reveal" style={{ '--delay': '0.16s' }}>
      <h2 className="text-lg font-semibold font-display theme-heading mb-4">Budget progress</h2>
      <div className="space-y-4">
        {withBudget.map((cat, i) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-sm font-medium theme-heading">
                <CategoryChip icon={cat.icon} color={cat.color} size={26} iconSize={13} className="!rounded-lg" />
                {cat.name}
              </span>
              <span className={`text-xs font-medium num ${getBudgetTextColor(cat.percent)}`}>
                {formatSGD(cat.spent)} / {formatSGD(cat.limit)}
              </span>
            </div>
            <div className="h-2 theme-progress-track rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full animate-bar-fill ${getBudgetBarColor(cat.percent)}`}
                style={{ width: `${Math.min(cat.percent, 100)}%`, animationDelay: `${0.2 + i * 0.12}s` }}
              />
            </div>
            {cat.message && (
              <p className={`text-xs ${getBudgetTextColor(cat.percent)}`}>{cat.message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
