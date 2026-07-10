import { useEffect, useState } from 'react'
import CategoryPicker from './CategoryPicker'

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
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'var(--theme-overlay)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--theme-border)' }} />
        <h2 className="text-xl font-bold theme-heading font-display mb-5">Edit expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-label mb-1.5">Amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted font-semibold text-lg num">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3.5 theme-input text-2xl font-bold num"
              />
            </div>
          </div>

          <div>
            <label className="block theme-label mb-1.5">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Groceries" className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-1.5">Category</label>
            <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block theme-label mb-1.5">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 theme-input" />
            </div>
            <div>
              <label className="block theme-label mb-1.5">Note (optional)</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="w-full px-4 py-3 theme-input" />
            </div>
          </div>

          {error && <p className="text-sm text-[var(--theme-error)]">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full py-3.5 theme-btn-gradient disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
