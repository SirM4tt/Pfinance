import { formatSGD } from '../../lib/utils'

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
      const percent = Math.min((spent / budgetLimit) * 100, 100)
      const overBudget = spent > budgetLimit
      return { ...cat, spent, limit: budgetLimit, percent, overBudget }
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, limit)

  if (!withBudget.length) {
    return (
      <div className="mx-4 mt-4 glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-2">Budget progress</h2>
        <p className="text-sm text-white/40">Set category budgets in the Budget tab</p>
      </div>
    )
  }

  return (
    <div className="mx-4 mt-4 glass-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Budget progress</h2>
      <div className="space-y-4">
        {withBudget.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white/80">
                {cat.icon} {cat.name}
              </span>
              <span className={`text-xs font-medium ${cat.overBudget ? 'text-accent-red' : 'text-white/50'}`}>
                {formatSGD(cat.spent)} / {formatSGD(cat.limit)}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  cat.overBudget
                    ? 'bg-accent-red'
                    : 'bg-gradient-to-r from-accent-green to-accent-blue'
                }`}
                style={{ width: `${cat.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
