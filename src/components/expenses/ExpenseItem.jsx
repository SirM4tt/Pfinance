import { useRef, useState } from 'react'
import { formatSGD } from '../../lib/utils'
import Icon, { CategoryChip } from '../icons/Icon'

const DELETE_WIDTH = 72

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const startOffset = useRef(0)

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX
    startOffset.current = offset
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    const dx = e.touches[0].clientX - startX.current
    const next = Math.min(0, Math.max(-DELETE_WIDTH, startOffset.current + dx))
    setOffset(next)
  }

  const handleTouchEnd = () => {
    setOffset(offset < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0)
    setIsDragging(false)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${expense.name}"?`)) {
      onDelete(expense.id)
    } else {
      setOffset(0)
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: DELETE_WIDTH, background: 'var(--theme-error)' }}
      >
        <button
          type="button"
          onClick={handleDelete}
          className="text-white text-sm font-semibold px-2"
        >
          Delete
        </button>
      </div>

      <div
        className="relative flex items-center gap-3 py-3.5"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          background: 'var(--theme-primary-light)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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

        <div className="flex flex-col items-end gap-1 flex-shrink-0 pr-1">
          <p className="text-sm font-bold text-[var(--theme-text-on-primary)] num">{formatSGD(expense.amount)}</p>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                setOffset(0)
                onEdit(expense)
              }}
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
    </div>
  )
}
