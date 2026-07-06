import { formatSGD } from '../../lib/utils'
import Icon, { CategoryChip } from '../icons/Icon'

export default function RecentExpenses({ expenses, onViewAll }) {
  const recent = expenses.slice(0, 5)

  return (
    <div className="mx-4 mt-4 mb-4 glass-card p-6 reveal" style={{ '--delay': '0.24s' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold font-display text-[var(--theme-text-on-primary)]">Recent expenses</h2>
        {expenses.length > 5 && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-0.5 text-sm font-medium text-[var(--theme-accent-secondary)] pressable"
          >
            View all
            <Icon name="chevron-right" size={15} />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-[var(--theme-text-muted)] text-center py-6">
          Add your first expense with the button below
        </p>
      ) : (
        <div className="space-y-3.5">
          {recent.map((exp, i) => (
            <div key={exp.id} className="flex items-center gap-3 reveal" style={{ '--delay': `${0.28 + i * 0.05}s` }}>
              <CategoryChip icon={exp.categories?.icon} color={exp.categories?.color} size={40} iconSize={18} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--theme-text-on-primary)] truncate">{exp.name}</p>
                <p className="text-xs text-[var(--theme-text-muted)]">
                  {exp.categories?.name || 'Uncategorized'} ·{' '}
                  {new Date(exp.date + 'T00:00:00').toLocaleDateString('en-SG', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <p className="text-sm font-semibold text-[var(--theme-text-on-primary)] num">{formatSGD(exp.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
