import { useRef, useState } from 'react'
import { useToast } from '../layout/Toast'
import { scanReceipt, matchCategoryId } from '../../lib/receiptScanner'
import Icon from '../icons/Icon'
import CategoryPicker from './CategoryPicker'

const DISMISS_THRESHOLD = 100

export default function AddExpenseModal({ isOpen, onClose, categories, onSubmit }) {
  const { showToast } = useToast()
  const fileInputRef = useRef(null)
  const sheetRef = useRef(null)
  const dragStartY = useRef(null)
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
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const resetForm = () => {
    setName('')
    setAmount('')
    setCategoryId(categories[0]?.id || '')
    setDate(today)
    setNote('')
    setThumbnail(null)
    setError('')
    setDragY(0)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleDragStart = (clientY) => {
    dragStartY.current = clientY
    setIsDragging(true)
  }

  const handleDragMove = (clientY) => {
    if (dragStartY.current === null) return
    const delta = Math.max(0, clientY - dragStartY.current)
    setDragY(delta)
  }

  const handleDragEnd = () => {
    if (dragY >= DISMISS_THRESHOLD) {
      handleClose()
    } else {
      setDragY(0)
    }
    dragStartY.current = null
    setIsDragging(false)
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
      <div
        className="absolute inset-0 animate-fade-in"
        style={{
          background: 'var(--theme-overlay)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: 1 - Math.min(dragY / 300, 0.4),
        }}
        onClick={handleClose}
      />
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        <div
          className="touch-none -mx-6 px-6 pb-2"
          onTouchStart={(e) => handleDragStart(e.touches[0].clientY)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientY)}
          onTouchEnd={handleDragEnd}
        >
          <div
            className="w-10 h-1 rounded-full mx-auto mb-4"
            style={{ background: 'var(--theme-border)' }}
          />
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold theme-heading font-display">Add expense</h2>
            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 flex items-center justify-center rounded-full theme-btn-ghost theme-muted"
              aria-label="Close"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

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
          className="w-full mb-5 py-3 rounded-2xl border border-dashed theme-heading font-medium flex items-center justify-center gap-2 disabled:opacity-50 pressable"
          style={{ borderColor: 'color-mix(in srgb, var(--theme-accent) 40%, transparent)', color: 'var(--theme-accent)' }}
        >
          <Icon name="camera" size={18} />
          Scan Receipt
        </button>

        {scanning && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm theme-muted">
            <span className="w-4 h-4 border-2 border-[var(--theme-accent)] border-t-transparent rounded-full animate-spin" />
            Scanning receipt...
          </div>
        )}

        {thumbnail && !scanning && (
          <div className="mb-4 flex items-center gap-3">
            <img
              src={thumbnail}
              alt="Scanned receipt"
              className="w-16 h-16 rounded-lg object-cover"
              style={{ border: '1px solid var(--theme-border)' }}
            />
            <p className="text-xs theme-muted">Receipt scanned — review details below</p>
          </div>
        )}

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
                autoFocus
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

          <button type="submit" disabled={submitting || scanning} className="w-full py-3.5 theme-btn-gradient disabled:opacity-50">
            {submitting ? 'Adding...' : 'Add expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
