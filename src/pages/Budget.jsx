import { useMemo, useState } from 'react'
import TopBar from '../components/layout/TopBar'
import IncomeSourcesSection from '../components/income/IncomeSourcesSection'
import { formatSGD } from '../lib/utils'

export default function Budget({
  monthKey,
  onMonthChange,
  categories,
  expenses,
  primaryIncome,
  sources,
  totalIncome,
  onSetBudgetLimit,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onEditPrimary,
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
    <div className="pb-28">
      <TopBar monthKey={monthKey} onMonthChange={onMonthChange} />

      <IncomeSourcesSection
        primaryIncome={primaryIncome}
        sources={sources}
        totalIncome={totalIncome}
        onAddSource={onAddSource}
        onUpdateSource={onUpdateSource}
        onDeleteSource={onDeleteSource}
        onEditPrimary={onEditPrimary}
      />

      <div className="mx-4 mb-6 glass-card p-5">
        <p className="text-white/60 text-sm mb-3">Monthly summary</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/50 uppercase">Total budget</p>
            <p className="text-xl font-bold text-white">{formatSGD(totalBudget)}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">Total spent</p>
            <p className={`text-xl font-bold ${totalSpent > totalBudget && totalBudget > 0 ? 'text-accent-red' : 'text-white'}`}>
              {formatSGD(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3">
        <h2 className="text-lg font-semibold text-white mb-2 px-1">Category budgets</h2>

        {categories.map((cat) => {
          const spent = spentByCategory[cat.id] || 0
          const limit = Number(cat.budget_limit) || 0
          const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
          const overBudget = limit > 0 && spent > limit

          return (
            <div key={cat.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${cat.color}30` }}
                  >
                    {cat.icon}
                  </span>
                  <div>
                    <p className="font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-white/50">
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
                      className="w-24 px-2 py-1 text-sm rounded-lg bg-white/10 border border-white/20 text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => saveBudget(cat.id)}
                      className="text-sm text-accent-green font-medium"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(cat)}
                    className="text-sm text-accent-blue font-medium px-3 py-1 rounded-lg hover:bg-white/10"
                  >
                    {limit > 0 ? 'Edit' : 'Set'}
                  </button>
                )}
              </div>

              {limit > 0 && (
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      overBudget ? 'bg-accent-red' : 'bg-gradient-to-r from-accent-green to-accent-blue'
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
