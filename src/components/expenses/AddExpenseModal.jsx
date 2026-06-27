import { useRef, useState } from 'react'
import { useToast } from '../layout/Toast'
import { scanReceipt, matchCategoryId } from '../../lib/receiptScanner'

export default function AddExpenseModal({ isOpen, onClose, categories, onSubmit }) {
  const { showToast } = useToast()
  const fileInputRef = useRef(null)
  const today = new Date().toISOString().split('T')[0]
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [thumbnail, setThumbnail] = useState(null)
  const [error, setError] = useState('')

  const resetForm = () => {
    setName('')
    setAmount('')
    setCategoryId(categories[0]?.id || '')
    setDate(today)
    setNote('')
    setThumbnail(null)
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleScanClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setScanning(true)
    setError('')

    try {
      const result = await scanReceipt(file)
      setName(result.merchant)
      setAmount(String(result.amount))
      if (result.date) {
        const parsed = new Date(result.date + 'T00:00:00')
        if (!isNaN(parsed.getTime())) {
          setDate(parsed.toISOString().split('T')[0])
        }
      }
      setCategoryId(matchCategoryId(result.category, categories))
      setThumbnail(result.thumbnail)
    } catch {
      showToast?.("Couldn't read receipt — please fill in manually")
    } finally {
      setScanning(false)
    }
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
      <div className="absolute inset-0" style={{ background: 'var(--theme-overlay)' }} onClick={handleClose} />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom">
        <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: 'var(--theme-border)' }} />
        <h2 className="text-xl font-bold theme-heading mb-4">Add expense</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />

        <button
          type="button"
          onClick={handleScanClick}
          disabled={scanning}
          className="w-full mb-4 py-3 rounded-xl border theme-heading font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ borderColor: 'var(--theme-border)' }}
        >
          📷 Scan Receipt
        </button>

        {scanning && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-[var(--theme-text-muted)]">
            <span className="w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full animate-spin" />
            Scanning receipt...
          </div>
        )}

        {thumbnail && !scanning && (
          <div className="mb-4 flex items-center gap-3">
            <img
              src={thumbnail}
              alt="Scanned receipt"
              className="w-16 h-16 rounded-lg object-cover border border-white/20"
            />
            <p className="text-xs text-[var(--theme-text-muted)]">Receipt scanned — review details below</p>
          </div>
        )}

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

          <button type="submit" disabled={submitting || scanning} className="w-full py-3.5 theme-btn-primary disabled:opacity-50">
            {submitting ? 'Adding...' : 'Add expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
