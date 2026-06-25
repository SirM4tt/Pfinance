import { formatMonthLabel, getGreeting } from '../../lib/utils'

export default function TopBar({ monthKey, onMonthChange }) {
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

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm text-gray-500">{getGreeting()}</p>
        <h1 className="text-xl font-bold text-gray-900">{formatMonthLabel(monthKey)}</h1>
      </div>
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button
          onClick={goToPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-gray-600"
          aria-label="Previous month"
        >
          ‹
        </button>
        <button
          onClick={goToNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-gray-600"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
    </header>
  )
}
