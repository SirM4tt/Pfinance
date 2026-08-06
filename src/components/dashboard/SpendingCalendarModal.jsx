import { useMemo, useState } from 'react'
import { formatSGD, formatMonthLabel, getMonthGrid, getMonthKey } from '../../lib/utils'
import Icon, { CategoryChip } from '../icons/Icon'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function SpendingCalendarModal({ isOpen, onClose, monthKey, expenses }) {
  const [selectedDay, setSelectedDay] = useState(null)

  const { daysInMonth, startWeekday } = useMemo(() => getMonthGrid(monthKey), [monthKey])

  const byDay = useMemo(() => {
    const map = {}
    for (const exp of expenses) {
      const day = Number(exp.date.split('-')[2])
      if (!map[day]) map[day] = { total: 0, items: [] }
      map[day].total += Number(exp.amount)
      map[day].items.push(exp)
    }
    return map
  }, [expenses])

  const monthTotal = useMemo(
    () => Object.values(byDay).reduce((sum, d) => sum + d.total, 0),
    [byDay]
  )
  const maxSpend = useMemo(
    () => Math.max(0, ...Object.values(byDay).map((d) => d.total)),
    [byDay]
  )

  const isCurrentMonth = monthKey === getMonthKey()
  const todayDate = new Date().getDate()

  const handleClose = () => {
    setSelectedDay(null)
    onClose()
  }

  if (!isOpen) return null

  const dayData = selectedDay ? byDay[selectedDay] : null
  const [gridYear, gridMonth] = monthKey.split('-').map(Number)
  const selectedDate = selectedDay ? new Date(gridYear, gridMonth - 1, selectedDay) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'var(--theme-overlay)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl pb-8 animate-slide-up safe-bottom max-h-[88vh] flex flex-col">
        <div className="w-10 h-1 rounded-full mx-auto mt-3.5 mb-1 flex-shrink-0" style={{ background: 'var(--theme-border)' }} />

        <div className="flex items-center justify-between px-6 pt-2 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg theme-btn-secondary flex-shrink-0 pressable"
                aria-label="Back to calendar"
              >
                <Icon name="chevron-left" size={16} />
              </button>
            )}
            <div className="min-w-0">
              <h2 className="text-lg font-bold theme-heading font-display truncate">
                {selectedDay
                  ? selectedDate.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' })
                  : formatMonthLabel(monthKey)}
              </h2>
              <p className="text-xs theme-muted">
                {selectedDay
                  ? dayData
                    ? `${dayData.items.length} expense${dayData.items.length !== 1 ? 's' : ''}`
                    : 'No expenses logged'
                  : 'Tap a day to see what you spent'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg theme-btn-secondary flex-shrink-0 pressable"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide px-6">
          {!selectedDay ? (
            <>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAY_LABELS.map((label, i) => (
                  <span key={i} className="text-center text-[10px] font-medium uppercase tracking-wide theme-muted">
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const spend = byDay[day]?.total || 0
                  const ratio = maxSpend > 0 ? spend / maxSpend : 0
                  const isToday = isCurrentMonth && day === todayDate
                  const alpha = spend > 0 ? 0.12 + ratio * 0.78 : 0
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className="aspect-square rounded-[11px] border flex flex-col items-center justify-center gap-0.5 pressable"
                      style={{
                        background: spend > 0 ? `color-mix(in srgb, var(--theme-accent) ${Math.round(alpha * 100)}%, transparent)` : 'var(--theme-surface)',
                        borderColor: isToday
                          ? 'var(--theme-accent-secondary)'
                          : spend > 0
                          ? `color-mix(in srgb, var(--theme-accent) ${Math.round(Math.min(alpha + 0.15, 0.9) * 100)}%, transparent)`
                          : 'transparent',
                        borderWidth: isToday ? '1.5px' : '1px',
                      }}
                    >
                      <span className="text-[12px] font-semibold" style={{ color: spend > 0 ? 'var(--theme-text-on-primary)' : 'var(--theme-text-muted)' }}>
                        {day}
                      </span>
                      {spend > 0 && (
                        <span className="text-[8.5px] font-semibold theme-muted num">{Math.round(spend)}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] theme-muted">
                <span>Less</span>
                <div className="flex gap-[3px]">
                  {[0.12, 0.32, 0.55, 0.78, 1].map((a) => (
                    <span
                      key={a}
                      className="w-3 h-3 rounded-[4px] border"
                      style={{
                        background: `color-mix(in srgb, var(--theme-accent) ${Math.round(a * 100)}%, transparent)`,
                        borderColor: 'var(--theme-border)',
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>

              <div className="flex items-baseline justify-between mt-4 pt-3.5 border-t theme-divider">
                <span className="text-xs theme-muted">Total spent this month</span>
                <span className="text-base font-bold theme-heading num">{formatSGD(monthTotal)}</span>
              </div>
            </>
          ) : dayData ? (
            <div className="pb-2">
              <div className="glass-card-elevated rounded-2xl p-4 mb-3.5">
                <p className="text-xs theme-muted mb-0.5">Total spent</p>
                <p className="text-2xl font-bold theme-heading num">{formatSGD(dayData.total)}</p>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--theme-border)' }}>
                {dayData.items.map((exp) => (
                  <div key={exp.id} className="flex items-center gap-3 py-3">
                    <CategoryChip icon={exp.categories?.icon} color={exp.categories?.color} size={38} iconSize={17} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium theme-heading truncate">{exp.name}</p>
                      <p className="text-xs theme-muted truncate">{exp.categories?.name || 'Uncategorized'}</p>
                    </div>
                    <p className="text-sm font-bold theme-heading num flex-shrink-0">{formatSGD(exp.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-14 theme-muted text-sm">Nothing logged this day</div>
          )}
        </div>
      </div>
    </div>
  )
}
