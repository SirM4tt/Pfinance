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
      <div className="absolute inset-0" style={{ background: 'var(--theme-overlay)' }} onClick={handleClose} />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom">
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--theme-border)' }} />
        <h2 className="text-xl font-bold theme-heading mb-6">Edit expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-label mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groceries" className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-1">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted font-medium">S$</span>
              <input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-10 pr-4 py-3 theme-input" />
            </div>
          </div>

          <div>
            <label className="block theme-label mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 theme-input">
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} style={{ background: 'var(--theme-modal-bg)' }}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block theme-label mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-1">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="w-full px-4 py-3 theme-input" />
          </div>

          {error && <p className="text-sm text-[var(--theme-error)]">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full py-3.5 theme-btn-primary disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
