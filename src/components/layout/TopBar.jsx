import { formatMonthLabel, getGreeting } from '../../lib/utils'
import Icon from '../icons/Icon'

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
  const textClass = isHero ? 'text-[var(--theme-hero-text-muted)]' : 'theme-muted'
  const titleClass = isHero ? 'text-[var(--theme-hero-text)]' : 'theme-heading'

  return (
    <header className={`flex items-center justify-between px-4 py-3 ${isHero ? '' : 'pt-5'}`}>
      <div>
        <p className={`text-sm ${textClass}`}>{getGreeting()}</p>
        <h1 className={`text-xl font-bold font-display ${titleClass}`}>{formatMonthLabel(monthKey)}</h1>
      </div>
      <div className="flex items-center gap-1 rounded-2xl p-1" style={{ background: 'var(--theme-surface)' }}>
        <button
          onClick={goToPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl theme-btn-ghost pressable"
          aria-label="Previous month"
        >
          <Icon name="chevron-left" size={18} />
        </button>
        <button
          onClick={goToNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-xl theme-btn-ghost pressable"
          aria-label="Next month"
        >
          <Icon name="chevron-right" size={18} />
        </button>
      </div>
    </header>
  )
}
