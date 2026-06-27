import { formatSGD } from '../../lib/utils'

export default function ExpenseItem({ expense, onEdit, onDelete }) {
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
        <p className="text-sm font-medium text-[var(--theme-text-on-primary)] truncate">{expense.name}</p>
        <p className="text-xs text-[var(--theme-text-muted)] truncate">
          {expense.categories?.name || 'Uncategorized'} ·{' '}
          {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-SG', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
          {expense.note && ` · ${expense.note}`}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <p className="text-sm font-bold text-[var(--theme-text-on-primary)]">{formatSGD(expense.amount)}</p>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(expense)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] transition-colors"
            style={{ background: 'transparent' }}
            aria-label="Edit expense"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-error)] transition-colors"
            aria-label="Delete expense"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
