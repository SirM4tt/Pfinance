import { useState } from 'react'
import { formatMonthLabel } from '../../lib/utils'

export default function WelcomeIncomeModal({ isOpen, monthKey, onSubmit }) {
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setError('Please enter your monthly income')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit(Number(amount))
      setAmount('')
    } catch (err) {
      setError(err.message || 'Failed to save income')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center login-bg px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-5xl mb-6">👋</div>
        <h1 className="text-3xl font-bold mb-3 gradient-text">Welcome to Pfinance</h1>
        <p className="theme-muted mb-8 text-lg leading-relaxed">
          Let&apos;s start by setting your monthly income
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6">
            <label className="block text-sm theme-muted mb-2 text-left">Monthly income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted font-medium text-lg">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full pl-12 pr-4 py-4 theme-input text-2xl font-semibold"
              />
            </div>
            <p className="text-sm theme-muted mt-3 text-left">
              This is your take-home pay for {formatMonthLabel(monthKey)}
            </p>
          </div>

          {error && <p className="text-sm text-[var(--theme-error)]">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 theme-btn-gradient text-lg disabled:opacity-50"
          >
            {submitting ? 'Saving...' : "Let's Go"}
          </button>
        </form>
      </div>
    </div>
  )
}
