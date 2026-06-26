export default function DonutChart({ data }) {
  if (!data?.length) {
    return (
      <div className="mx-4 mt-2 glass-card p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-text-on-primary)] mb-4">Spending by category</h2>
        <div className="h-40 flex items-center justify-center text-[var(--theme-text-muted)] text-sm">
          No expenses this month yet
        </div>
      </div>
    )
  }

  let gradientStops = []
  let cursor = 0
  for (const cat of data) {
    const end = cursor + cat.percentage
    gradientStops.push(`${cat.color} ${cursor}% ${end}%`)
    cursor = end
  }

  return (
    <div className="mx-4 mt-2 glass-card p-6">
      <h2 className="text-lg font-semibold text-[var(--theme-text-on-primary)] mb-4">Spending by category</h2>

      <div className="flex justify-center mb-4">
        <div
          className="w-44 h-44 rounded-full relative"
          style={{ background: `conic-gradient(${gradientStops.join(', ')})` }}
        >
          <div
            className="absolute inset-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            <span className="text-[var(--theme-text-muted)] text-xs text-center leading-tight">
              {data.length} categor{data.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-[var(--theme-text-on-primary)] truncate">
                {cat.icon} {cat.name}
              </span>
            </div>
            <span className="text-[var(--theme-text-muted)] font-medium flex-shrink-0 ml-2">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
