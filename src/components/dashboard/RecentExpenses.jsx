import { formatSGD } from '../../lib/utils'

export default function RecentExpenses({ expenses, onViewAll }) {
  const recent = expenses.slice(0, 5)

  return (
    <div className="mx-4 mt-6 mb-24 bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent expenses</h2>
        {expenses.length > 5 && (
          <button onClick={onViewAll} className="text-sm text-navy font-medium">
            View all
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No expenses yet. Tap + to add one.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((exp) => (
            <div key={exp.id} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: `${exp.categories?.color || '#94a3b8'}20` }}
              >
                {exp.categories?.icon || '💳'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{exp.name}</p>
                <p className="text-xs text-gray-400">
                  {exp.categories?.name || 'Uncategorized'} ·{' '}
                  {new Date(exp.date + 'T00:00:00').toLocaleDateString('en-SG', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatSGD(exp.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
