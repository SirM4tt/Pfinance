import { useState } from 'react'
import {
  getMonthlyRecommendation,
  formatTargetMonth,
  addMonthsToDate,
} from '../../lib/splurgeRecommendations'
import { formatSGD } from '../../lib/utils'

function TierButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl border transition-all"
      style={{
        borderColor: selected ? 'var(--theme-accent)' : 'var(--theme-border)',
        background: selected ? 'color-mix(in srgb, var(--theme-accent) 12%, transparent)' : 'var(--theme-surface)',
      }}
    >
      {children}
    </button>
  )
}

export default function AddContributionModal({ isOpen, onClose, goal, onSubmit }) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !goal) return null

  const rec = getMonthlyRecommendation(Number(goal.target_amount), Number(goal.saved), goal.target_date)

  const handleTierSelect = (tierAmount) => setAmount(tierAmount.toString())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit({ amount: Number(amount), date, note: note.trim() || null })
      setAmount('')
      setNote('')
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to add contribution')
    } finally {
      setSubmitting(false)
    }
  }

  const relaxedDate = formatTargetMonth(addMonthsToDate(goal.target_date, 1))
  const onTrackDate = formatTargetMonth(goal.target_date)
  const fastDate = formatTargetMonth(addMonthsToDate(goal.target_date, -1))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0" style={{ background: 'var(--theme-overlay)' }} onClick={onClose} />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--theme-border)' }} />
        <h2 className="text-xl font-bold theme-heading mb-1">Add Contribution</h2>
        <p className="text-sm theme-muted mb-6">{goal.emoji} {goal.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-label mb-1">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted">S$</span>
              <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-10 pr-4 py-3 theme-input text-xl font-semibold" />
            </div>
          </div>

          {rec.remaining > 0 && (
            <div className="space-y-2">
              <p className="text-sm theme-muted">Recommended top-ups:</p>
              <TierButton selected={Number(amount) === rec.relaxed} onClick={() => handleTierSelect(rec.relaxed)}>
                <span className="theme-heading">🐢 Relaxed</span>
                <span className="float-right font-semibold theme-heading">{formatSGD(rec.relaxed)}/mo</span>
                <p className="text-xs theme-muted mt-0.5">goal by {relaxedDate}</p>
              </TierButton>
              <TierButton selected={Number(amount) === rec.recommended} onClick={() => handleTierSelect(rec.recommended)}>
                <span className="theme-heading">✅ On track</span>
                <span className="float-right font-semibold theme-accent-text">{formatSGD(rec.recommended)}/mo</span>
                <p className="text-xs theme-muted mt-0.5">goal by {onTrackDate}</p>
              </TierButton>
              <TierButton selected={Number(amount) === rec.aggressive} onClick={() => handleTierSelect(rec.aggressive)}>
                <span className="theme-heading">🚀 Fast track</span>
                <span className="float-right font-semibold" style={{ color: 'var(--theme-accent-secondary)' }}>{formatSGD(rec.aggressive)}/mo</span>
                <p className="text-xs theme-muted mt-0.5">goal by {fastDate}</p>
              </TierButton>
            </div>
          )}

          <div>
            <label className="block theme-label mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-1">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. birthday money" className="w-full px-4 py-3 theme-input" />
          </div>

          {error && <p className="text-sm text-[var(--theme-error)]">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full py-3.5 theme-btn-gradient disabled:opacity-50">
            {submitting ? 'Adding...' : 'Add contribution'}
          </button>
        </form>
      </div>
    </div>
  )
}
