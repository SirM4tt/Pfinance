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
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 safe-bottom">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Monthly income</h2>
        <p className="text-sm text-gray-500 mb-6">Set your income for this month</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-2xl font-semibold"
              />
            </div>
            {currentIncome > 0 && (
              <p className="text-xs text-gray-400 mt-1">Current: {formatSGD(currentIncome)}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-navy text-white font-semibold rounded-2xl hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save income'}
          </button>
        </form>
      </div>
    </div>
  )
}
