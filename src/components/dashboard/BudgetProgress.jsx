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
      const limit = Number(cat.budget_limit)
      const percent = Math.min((spent / limit) * 100, 100)
      const overBudget = spent > limit
      return { ...cat, spent, limit, percent, overBudget }
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, limit)

  if (!withBudget.length) {
    return (
      <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Budget progress</h2>
        <p className="text-sm text-gray-400">Set category budgets in the Budget tab</p>
      </div>
    )
  }

  return (
    <div className="mx-4 mt-6 bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget progress</h2>
      <div className="space-y-4">
        {withBudget.map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {cat.icon} {cat.name}
              </span>
              <span className={`text-xs font-medium ${cat.overBudget ? 'text-red-500' : 'text-gray-500'}`}>
                {formatSGD(cat.spent)} / {formatSGD(cat.limit)}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  cat.overBudget ? 'bg-red-500' : 'bg-navy'
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
