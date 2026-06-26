import { useState } from 'react'
import { formatSGD } from '../../lib/utils'

export default function SetIncomeModal({ isOpen, onClose, currentIncome, onSubmit }) {
  const [amount, setAmount] = useState(currentIncome?.toString() || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleClose = () => {
    setAmount(currentIncome?.toString() || '')
    setError('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (amount === '' || Number(amount) < 0) {
      setError('Please enter a valid amount')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit(Number(amount))
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update income')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-navy-dark rounded-t-3xl p-6 pb-8 safe-bottom">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-white mb-2">Monthly income</h2>
        <p className="text-sm text-white/50 mb-6">Set your primary salary for this month</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-medium">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-accent-green/30"
              />
            </div>
            {currentIncome > 0 && (
              <p className="text-xs text-white/40 mt-1">Current: {formatSGD(currentIncome)}</p>
            )}
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-accent-green to-accent-blue text-navy-dark font-semibold rounded-2xl disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save income'}
          </button>
        </form>
      </div>
    </div>
  )
}
