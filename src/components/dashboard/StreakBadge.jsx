import Icon from '../icons/Icon'

export default function StreakBadge({ streak, onTap }) {
  if (!streak || streak <= 0) return null

  return (
    <button
      onClick={onTap}
      className="mx-4 mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-full glass-card text-sm theme-heading pressable reveal"
      style={{ '--delay': '0.12s' }}
    >
      <span className="animate-flame" style={{ color: '#fb923c' }}>
        <Icon name="flame" size={16} strokeWidth={2.2} fill="color-mix(in srgb, #fb923c 30%, transparent)" />
      </span>
      <span className="num font-semibold">{streak}</span> month{streak !== 1 ? 's' : ''} under budget
    </button>
  )
}
