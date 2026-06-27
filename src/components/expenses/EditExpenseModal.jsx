import { useEffect, useState } from 'react'

export default function EditExpenseModal({ isOpen, expense, categories, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!expense) return
    setName(expense.name || '')
    setAmount(String(expense.amount ?? ''))
    setCategoryId(expense.category_id || categories[0]?.id || '')
    setDate(expense.date || '')
    setNote(expense.note || '')
    setError('')
  }, [expense, categories])

  const handleClose = () => {
    setError('')
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
      await onSubmit(expense.id, {
        name: name.trim(),
        amount: Number(amount),
        category_id: categoryId || null,
        date,
        note: note.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to update expense')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen || !expense) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div
        className="relative w-full max-w-lg rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom"
        style={{ background: 'var(--theme-primary-light)' }}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-[var(--theme-text-on-primary)] mb-6">Edit expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-muted)] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-muted)] mb-1">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-muted)] font-medium">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-muted)] mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: 'var(--theme-primary)' }}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-muted)] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--theme-text-muted)] mb-1">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)] placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]/30"
            />
          </div>

          {error && <p className="text-sm text-amber-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 font-semibold rounded-2xl disabled:opacity-50 text-[var(--theme-primary)]"
            style={{ background: 'var(--theme-accent)' }}
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
