import { useState } from 'react'

export default function AddExpenseModal({ isOpen, onClose, categories, onSubmit }) {
  const today = new Date().toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setAmount('')
    setCategoryId(categories[0]?.id || '')
    setDate(today)
    setNote('')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await onSubmit({
        name: name.trim(),
        amount: Number(amount),
        category_id: categoryId || null,
        date,
        note: note.trim() || null,
      })
      resetForm()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>

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
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-navy text-white font-semibold rounded-2xl hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
