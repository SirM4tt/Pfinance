import { formatSGD } from '../../lib/utils'

export default function ExpenseItem({ expense, onDelete }) {
  const handleLongPress = (e) => {
    e.preventDefault()
    if (window.confirm(`Delete "${expense.name}"?`)) {
      onDelete(expense.id)
    }
  }

  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 group"
      onContextMenu={handleLongPress}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${expense.categories?.color || '#94a3b8'}20` }}
      >
        {expense.categories?.icon || '💳'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{expense.name}</p>
        <p className="text-xs text-gray-400">
          {expense.categories?.name || 'Uncategorized'} ·{' '}
          {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-SG', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
          {expense.note && ` · ${expense.note}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-900">{formatSGD(expense.amount)}</p>
        <button
          onClick={() => onDelete(expense.id)}
          className="opacity-0 group-hover:opacity-100 md:opacity-100 text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
          aria-label="Delete expense"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
