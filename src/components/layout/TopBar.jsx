import { formatMonthLabel, getGreeting } from '../../lib/utils'

export default function TopBar({ monthKey, onMonthChange, variant }) {
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

  const goToPrevMonth = () => {
    date.setMonth(date.getMonth() - 1)
    onMonthChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }

  const goToNextMonth = () => {
    date.setMonth(date.getMonth() + 1)
    onMonthChange(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
  }

  const isHero = variant === 'hero'

  return (
    <header className={`flex items-center justify-between px-4 py-3 ${isHero ? '' : 'pt-5'}`}>
      <div>
        <p className={`text-sm ${isHero ? 'text-white/60' : 'text-white/50'}`}>{getGreeting()}</p>
        <h1 className="text-xl font-bold text-white">{formatMonthLabel(monthKey)}</h1>
      </div>
      <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
        <button
          onClick={goToPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70"
          aria-label="Previous month"
        >
          ‹
        </button>
        <button
          onClick={goToNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
    </header>
  )
}
