// Lightweight CSS confetti burst — used when a splurge goal is fully funded.
const PIECES = 18
const COLORS = ['var(--theme-accent)', 'var(--theme-accent-secondary)', '#fbbf24', '#f87171', '#f9a8d4']

export default function Confetti() {
  return (
    <div className="absolute inset-x-0 top-0 h-0 pointer-events-none overflow-visible" aria-hidden="true">
      {Array.from({ length: PIECES }).map((_, i) => {
        const left = 6 + (i * 88) / PIECES + (i % 3) * 1.5
        const delay = (i % 6) * 0.12
        const duration = 1.6 + (i % 4) * 0.3
        const size = 5 + (i % 3) * 2
        return (
          <span
            key={i}
            className="absolute rounded-[2px]"
            style={{
              left: `${left}%`,
              top: 0,
              width: size,
              height: size * 1.6,
              background: COLORS[i % COLORS.length],
              animation: `confetti-fall ${duration}s ease-in ${delay}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}
