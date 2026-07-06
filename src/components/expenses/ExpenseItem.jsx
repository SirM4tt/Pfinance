import { formatSGD } from '../../lib/utils'
import Icon, { CategoryChip } from '../icons/Icon'

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${expense.name}"?`)) {
      onDelete(expense.id)
    }
  }

  return (
    <div className="flex items-center gap-3 py-3.5">
      <CategoryChip icon={expense.categories?.icon} color={expense.categories?.color} size={44} iconSize={19} />

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

      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <p className="text-sm font-bold text-[var(--theme-text-on-primary)] num">{formatSGD(expense.amount)}</p>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onEdit(expense)}
            className="w-8 h-7 flex items-center justify-center rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] transition-colors pressable"
            aria-label="Edit expense"
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-8 h-7 flex items-center justify-center rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-error)] transition-colors pressable"
            aria-label="Delete expense"
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
