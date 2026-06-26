import { useState } from 'react'
import {
  getMonthlyRecommendation,
  formatTargetMonth,
  addMonthsToDate,
} from '../../lib/splurgeRecommendations'
import { formatSGD } from '../../lib/utils'

export default function AddContributionModal({ isOpen, onClose, goal, onSubmit }) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !goal) return null

  const rec = getMonthlyRecommendation(
    Number(goal.target_amount),
    Number(goal.saved),
    goal.target_date
  )

  const handleTierSelect = (tierAmount) => {
    setAmount(tierAmount.toString())
  }

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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-navy-dark rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-white mb-1">Add Contribution</h2>
        <p className="text-sm text-white/50 mb-6">
          {goal.emoji} {goal.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent-green/50"
              />
            </div>
          </div>

          {rec.remaining > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/60">Recommended top-ups:</p>
              <button
                type="button"
                onClick={() => handleTierSelect(rec.relaxed)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  Number(amount) === rec.relaxed
                    ? 'border-accent-yellow bg-accent-yellow/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-white/80">🐢 Relaxed</span>
                <span className="float-right font-semibold text-white">
                  {formatSGD(rec.relaxed)}/mo
                </span>
                <p className="text-xs text-white/40 mt-0.5">goal by {relaxedDate}</p>
              </button>
              <button
                type="button"
                onClick={() => handleTierSelect(rec.recommended)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  Number(amount) === rec.recommended
                    ? 'border-accent-green bg-accent-green/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-white/80">✅ On track</span>
                <span className="float-right font-semibold text-accent-green">
                  {formatSGD(rec.recommended)}/mo
                </span>
                <p className="text-xs text-white/40 mt-0.5">goal by {onTrackDate}</p>
              </button>
              <button
                type="button"
                onClick={() => handleTierSelect(rec.aggressive)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  Number(amount) === rec.aggressive
                    ? 'border-accent-blue bg-accent-blue/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-white/80">🚀 Fast track</span>
                <span className="float-right font-semibold text-accent-blue">
                  {formatSGD(rec.aggressive)}/mo
                </span>
                <p className="text-xs text-white/40 mt-0.5">goal by {fastDate}</p>
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. birthday money"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent-green/50"
            />
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-accent-green to-accent-blue text-navy-dark font-semibold rounded-2xl disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add contribution'}
          </button>
        </form>
      </div>
    </div>
  )
}
