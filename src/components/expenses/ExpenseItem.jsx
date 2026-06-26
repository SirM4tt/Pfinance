import { formatSGD } from '../../lib/utils'

export default function ExpenseItem({ expense, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${expense.name}"?`)) {
      onDelete(expense.id)
    }
  }

  return (
    <div className="flex items-center gap-3 py-3">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${expense.categories?.color || '#94a3b8'}30` }}
      >
        {expense.categories?.icon || '💳'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{expense.name}</p>
        <p className="text-xs text-white/40">
          {expense.categories?.name || 'Uncategorized'} ·{' '}
          {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-SG', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
          {expense.note && ` · ${expense.note}`}
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <p className="text-sm font-bold text-accent-red/90">{formatSGD(expense.amount)}</p>
        <button
          onClick={handleDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
          aria-label="Delete expense"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
