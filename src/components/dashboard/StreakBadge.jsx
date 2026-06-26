export default function StreakBadge({ streak, onTap }) {
  if (!streak || streak <= 0) return null

  return (
    <button
      onClick={onTap}
      className="mx-4 mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--theme-card-bg)] text-sm text-[var(--theme-text-on-primary)] border border-white/10"
    >
      🔥 {streak} month{streak !== 1 ? 's' : ''} under budget
    </button>
  )
}
