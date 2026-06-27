import { useState, useEffect } from 'react'
import { getMonthlyRecommendation, formatTargetMonth } from '../../lib/splurgeRecommendations'
import { formatSGD } from '../../lib/utils'

const EMOJIS = ['🛍️', '📱', '✈️', '🎮', '👟', '💻', '🎸', '🏠', '🚗', '⌚', '📷', '🎁']

export default function AddGoalModal({ isOpen, onClose, onSubmit, editGoal }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🛍️')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editGoal) {
      setName(editGoal.name)
      setEmoji(editGoal.emoji || '🛍️')
      setTargetAmount(editGoal.target_amount.toString())
      setTargetDate(editGoal.target_date)
      setDescription(editGoal.description || '')
    } else {
      setName('')
      setEmoji('🛍️')
      setTargetAmount('')
      const defaultDate = new Date()
      defaultDate.setMonth(defaultDate.getMonth() + 3)
      setTargetDate(defaultDate.toISOString().split('T')[0])
      setDescription('')
    }
  }, [editGoal, isOpen])

  const recommendation =
    targetAmount && targetDate
      ? getMonthlyRecommendation(Number(targetAmount), editGoal?.saved ?? 0, targetDate)
      : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !targetAmount || !targetDate) {
      setError('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit({
        name: name.trim(),
        emoji,
        target_amount: Number(targetAmount),
        target_date: targetDate,
        description: description.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save goal')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0" style={{ background: 'var(--theme-overlay)' }} onClick={onClose} />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom max-h-[90vh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--theme-border)' }} />
        <h2 className="text-xl font-bold theme-heading mb-6">
          {editGoal ? 'Edit Splurge Goal' : 'New Splurge Goal'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-label mb-1">Goal name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. iPhone 16 Pro" className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-2">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: emoji === e ? 'color-mix(in srgb, var(--theme-accent) 25%, transparent)' : 'var(--theme-surface)',
                    boxShadow: emoji === e ? '0 0 0 2px var(--theme-accent)' : 'none',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block theme-label mb-1">Target amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted">S$</span>
              <input type="number" step="0.01" min="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="w-full pl-10 pr-4 py-3 theme-input" />
            </div>
          </div>

          <div>
            <label className="block theme-label mb-1">Target date</label>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-1">Description (optional)</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 theme-input" />
          </div>

          {recommendation && recommendation.remaining > 0 && (
            <div className="glass-card p-4 text-sm theme-muted">
              💡 To reach {formatSGD(Number(targetAmount))} by {formatTargetMonth(targetDate)},
              top up <span className="font-bold theme-accent-text">{formatSGD(recommendation.recommended)}/month</span>
            </div>
          )}

          {error && <p className="text-sm text-[var(--theme-error)]">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full py-3.5 theme-btn-gradient disabled:opacity-50">
            {submitting ? 'Saving...' : editGoal ? 'Update goal' : 'Create goal'}
          </button>
        </form>
      </div>
    </div>
  )
}
