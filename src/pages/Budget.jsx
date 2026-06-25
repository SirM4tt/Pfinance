import { useMemo, useState } from 'react'
import TopBar from '../components/layout/TopBar'
import { formatSGD } from '../lib/utils'

export default function Budget({
  monthKey,
  onMonthChange,
  categories,
  expenses,
  onSetBudgetLimit,
}) {
  const [editingId, setEditingId] = useState(null)
  const [budgetInput, setBudgetInput] = useState('')

  const spentByCategory = useMemo(() => {
    const map = {}
    for (const exp of expenses) {
      if (!exp.category_id) continue
      map[exp.category_id] = (map[exp.category_id] || 0) + Number(exp.amount)
    }
    return map
  }, [expenses])

  const totalBudget = categories.reduce((sum, cat) => sum + (Number(cat.budget_limit) || 0), 0)
  const totalSpent = Object.values(spentByCategory).reduce((sum, v) => sum + v, 0)

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setBudgetInput(cat.budget_limit?.toString() || '')
  }

  const saveBudget = async (catId) => {
    const value = budgetInput === '' ? null : Number(budgetInput)
    await onSetBudgetLimit(catId, value)
    setEditingId(null)
    setBudgetInput('')
  }

  return (
    <div className="pb-20">
      <TopBar monthKey={monthKey} onMonthChange={onMonthChange} />

      <div className="mx-4 mb-6 bg-navy text-white rounded-2xl p-5">
        <p className="text-white/60 text-sm mb-1">Monthly summary</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/60 uppercase">Total budget</p>
            <p className="text-xl font-bold">{formatSGD(totalBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-white/60 uppercase">Total spent</p>
            <p className={`text-xl font-bold ${totalSpent > totalBudget && totalBudget > 0 ? 'text-red-300' : ''}`}>
              {formatSGD(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Category budgets</h2>

        {categories.map((cat) => {
          const spent = spentByCategory[cat.id] || 0
          const limit = Number(cat.budget_limit) || 0
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
          const overBudget = limit > 0 && spent > limit

          return (
            <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-400">
                      {limit > 0 ? `${formatSGD(spent)} of ${formatSGD(limit)}` : 'No budget set'}
                    </p>
                  </div>
                </div>

                {editingId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={budgetInput}
                      onChange={(e) => setBudgetInput(e.target.value)}
                      placeholder="S$"
                      className="w-24 px-2 py-1 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20"
                      autoFocus
                    />
                    <button
                      onClick={() => saveBudget(cat.id)}
                      className="text-sm text-navy font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-sm text-navy font-medium px-3 py-1 rounded-lg hover:bg-gray-50"
                  >
                    {limit > 0 ? 'Edit' : 'Set'}
                  </button>
                )}
              </div>

              {limit > 0 && (
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      overBudget ? 'bg-red-500' : 'bg-navy'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
