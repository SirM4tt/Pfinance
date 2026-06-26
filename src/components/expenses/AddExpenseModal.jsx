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
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full max-w-lg bg-navy-dark rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom">
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-white mb-6">Add expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            />
          </div>

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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-navy-dark">
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-green/30"
            />
          </div>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-navy to-navy-light text-white font-semibold rounded-2xl disabled:opacity-50"
          >
            {submitting ? 'Adding...' : 'Add expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
