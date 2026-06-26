import { formatSGD } from '../../lib/utils'

export default function BalanceHero({ income, totalSpent, monthLabel }) {
  const remaining = income - totalSpent
  const spentPercent = income > 0 ? Math.min((totalSpent / income) * 100, 100) : 0

  return (
    <div className="mx-4 mb-6 rounded-3xl p-6 relative overflow-hidden bg-white/5 border border-white/10">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.35) 0%, transparent 70%)' }}
      />

      <div className="relative">
        <p className="text-white/50 text-sm mb-1">{monthLabel}</p>
        <p className="text-white/70 text-sm mb-1">Remaining balance</p>
        <p className={`text-4xl font-bold mb-6 ${remaining < 0 ? 'text-accent-red' : 'gradient-text'}`}>
          {formatSGD(remaining)}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Income</p>
            <p className="text-lg font-semibold text-accent-green">{formatSGD(income)}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wide">Spent</p>
            <p className="text-lg font-semibold text-accent-red">{formatSGD(totalSpent)}</p>
          </div>
        </div>

        {income > 0 && (
          <div>
            <div className="flex justify-between text-xs text-white/50 mb-1">
              <span>Budget used</span>
              <span>{Math.round(spentPercent)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${
                  spentPercent >= 100
                    ? 'bg-accent-red'
                    : 'bg-gradient-to-r from-accent-green to-accent-blue'
                }`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
