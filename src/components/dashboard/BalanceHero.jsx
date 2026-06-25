import { formatSGD } from '../../lib/utils'

export default function BalanceHero({ income, totalSpent, monthLabel }) {
  const remaining = income - totalSpent
  const spentPercent = income > 0 ? Math.min((totalSpent / income) * 100, 100) : 0

  return (
    <div className="mx-4 rounded-3xl bg-navy text-white p-6 shadow-xl">
      <p className="text-white/60 text-sm mb-1">{monthLabel}</p>
      <p className="text-white/80 text-sm mb-1">Remaining balance</p>
      <p className={`text-4xl font-bold mb-6 ${remaining < 0 ? 'text-red-400' : ''}`}>
        {formatSGD(remaining)}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wide">Income</p>
          <p className="text-lg font-semibold text-green-300">{formatSGD(income)}</p>
        </div>
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wide">Spent</p>
          <p className="text-lg font-semibold text-red-300">{formatSGD(totalSpent)}</p>
        </div>
      </div>

      {income > 0 && (
        <div>
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Budget used</span>
            <span>{Math.round(spentPercent)}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                spentPercent >= 100 ? 'bg-red-400' : 'bg-green-400'
              }`}
              style={{ width: `${spentPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
