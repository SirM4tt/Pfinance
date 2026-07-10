import { useEffect, useState } from 'react'
import { formatSGD } from '../../lib/utils'
import { useCountUp } from '../../hooks/useCountUp'
import { CategoryChip } from '../icons/Icon'

const SIZE = 200
const STROKE = 22
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R
const GAP = 2.5 // degrees of breathing room between segments

export default function DonutChart({ data }) {
  const [drawn, setDrawn] = useState(false)
  const total = (data || []).reduce((s, c) => s + c.total, 0)
  const animatedTotal = useCountUp(total)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!data?.length) {
    return (
      <div className="mx-4 mt-2 glass-card p-6 reveal">
        <h2 className="text-lg font-semibold font-display text-[var(--theme-text-on-primary)] mb-4">
          Spending by category
        </h2>
        <div className="h-40 flex items-center justify-center text-[var(--theme-text-muted)] text-sm">
          No expenses this month yet
        </div>
      </div>
    )
  }

  // Build arc segments (skip the gap when a slice basically fills the ring)
  const useGaps = data.length > 1
  let cursor = -90 // start at 12 o'clock
  const segments = data.map((cat) => {
    const sweep = (cat.total / total) * 360
    const gap = useGaps ? Math.min(GAP, sweep * 0.3) : 0
    const arc = Math.max(sweep - gap, 0.5)
    const seg = {
      id: cat.id,
      color: cat.color,
      dash: (arc / 360) * CIRC,
      offset: ((cursor + gap / 2) / 360) * CIRC,
    }
    cursor += sweep
    return seg
  })

  return (
    <div className="mx-4 mt-2 glass-card p-6 reveal" style={{ '--delay': '0.08s' }}>
      <h2 className="text-lg font-semibold font-display text-[var(--theme-text-on-primary)] mb-4">
        Spending by category
      </h2>

      <div className="flex justify-center mb-5">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="var(--theme-progress-track)"
              strokeWidth={STROKE - 8}
            />
            {segments.map((seg, i) => (
              <circle
                key={seg.id}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={`${drawn ? seg.dash : 0.5} ${CIRC}`}
                strokeDashoffset={-seg.offset}
                style={{
                  transition: `stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${i * 90}ms`,
                }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[var(--theme-text-muted)] text-[11px] uppercase tracking-wider">Spent</span>
            <span className="theme-heading font-bold text-xl num">{formatSGD(animatedTotal)}</span>
            <span className="text-[var(--theme-text-muted)] text-[11px]">
              {data.length} categor{data.length === 1 ? 'y' : 'ies'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {data.map((cat, i) => (
          <div
            key={cat.id}
            className="flex items-center justify-between text-sm reveal"
            style={{ '--delay': `${0.15 + i * 0.05}s` }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CategoryChip icon={cat.icon} color={cat.color} size={28} iconSize={14} className="!rounded-lg" />
              <span className="text-[var(--theme-text-on-primary)] truncate">{cat.name}</span>
            </div>
            <div className="flex items-baseline gap-2 flex-shrink-0 ml-2">
              <span className="text-[var(--theme-text-muted)] text-xs num">{formatSGD(cat.total)}</span>
              <span className="theme-heading font-semibold num w-10 text-right">{cat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
