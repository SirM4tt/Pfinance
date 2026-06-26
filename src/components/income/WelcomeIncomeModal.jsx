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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-[#0f3460] px-6">
      <div className="w-full max-w-sm text-center text-white">
        <div className="text-5xl mb-6">👋</div>
        <h1 className="text-3xl font-bold mb-3 gradient-text">Welcome to Pfinance</h1>
        <p className="text-white/70 mb-8 text-lg leading-relaxed">
          Let&apos;s start by setting your monthly income
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6">
            <label className="block text-sm text-white/60 mb-2 text-left">Monthly income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium text-lg">
                S$
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent-green/50 placeholder:text-white/30"
              />
            </div>
            <p className="text-sm text-white/50 mt-3 text-left">
              This is your take-home pay for {formatMonthLabel(monthKey)}
            </p>
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-accent-green to-accent-blue text-navy-dark font-bold rounded-2xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? 'Saving...' : "Let's Go"}
          </button>
        </form>
      </div>
    </div>
  )
}
