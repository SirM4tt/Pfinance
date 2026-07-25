import { useEffect, useMemo, useState } from 'react'
import { equalShares, roundCents, totalWithTip } from '../../lib/splitMath'
import { formatSGD } from '../../lib/utils'
import Icon from '../icons/Icon'
import CategoryPicker from '../expenses/CategoryPicker'

const YOU = 'You'
const TIP_PRESETS = [0, 10, 15]

export default function CreateSplitModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
}) {
  const today = new Date().toISOString().split('T')[0]

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [tipPercent, setTipPercent] = useState(0)
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [people, setPeople] = useState([YOU, ''])
  const [payer, setPayer] = useState(YOU)
  const [customMode, setCustomMode] = useState(false)
  const [customAmounts, setCustomAmounts] = useState([])
  const [logExpense, setLogExpense] = useState(true)
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const names = useMemo(() => people.map((p) => p.trim()).filter(Boolean), [people])
  const grandTotal = totalWithTip(amount, tipPercent)
  const previewShares = useMemo(() => {
    if (!names.length || !grandTotal) return []
    if (customMode && customAmounts.length === names.length) {
      return customAmounts.map(roundCents)
    }
    return equalShares(grandTotal, names.length)
  }, [names, grandTotal, customMode, customAmounts])

  const customSum = roundCents(customAmounts.reduce((s, n) => s + (Number(n) || 0), 0))

  useEffect(() => {
    if (!customMode) return
    setCustomAmounts((prev) => {
      if (prev.length === names.length && names.length > 0) return prev
      return equalShares(grandTotal || 0, Math.max(names.length, 1))
    })
  }, [customMode, names.length, grandTotal])

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setTipPercent(0)
    setDate(today)
    setNote('')
    setPeople([YOU, ''])
    setPayer(YOU)
    setCustomMode(false)
    setCustomAmounts([])
    setLogExpense(true)
    setCategoryId(categories[0]?.id || '')
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const updatePerson = (index, value) => {
    setPeople((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const addPerson = () => setPeople((prev) => [...prev, ''])

  const removePerson = (index) => {
    setPeople((prev) => {
      if (prev.length <= 2) return prev
      const next = prev.filter((_, i) => i !== index)
      if (!next.includes(payer)) setPayer(next[0] || YOU)
      return next
    })
  }

  const enableCustom = () => {
    setCustomMode(true)
    setCustomAmounts(equalShares(grandTotal || 0, Math.max(names.length, 1)))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Add a title')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    if (names.length < 2) {
      setError('Add at least two people')
      return
    }
    if (!names.includes(payer)) {
      setError('Pick who paid')
      return
    }
    if (customMode && Math.abs(customSum - grandTotal) > 0.01) {
      setError(`Custom amounts must add up to ${formatSGD(grandTotal)}`)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        title: title.trim(),
        total_amount: Number(amount),
        tip_percent: tipPercent,
        payer_name: payer,
        date,
        note,
        names,
        customAmounts: customMode ? customAmounts.map(Number) : null,
        logExpense,
        category_id: categoryId,
      })
      resetForm()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create split')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: 'var(--theme-overlay)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />
      <div className="relative w-full max-w-lg theme-modal rounded-t-3xl p-6 pb-8 animate-slide-up safe-bottom max-h-[92vh] overflow-y-auto scrollbar-hide">
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--theme-border)' }} />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold theme-heading font-display">New split</h2>
          <button type="button" onClick={handleClose} className="w-9 h-9 flex items-center justify-center rounded-full theme-btn-ghost" aria-label="Close">
            <Icon name="x" size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block theme-label mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dinner at Burnt Ends"
              className="w-full px-4 py-3 theme-input"
            />
          </div>

          <div>
            <label className="block theme-label mb-1.5">Bill amount (SGD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted font-medium">S$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 theme-input text-xl font-semibold num"
              />
            </div>
          </div>

          <div>
            <label className="block theme-label mb-1.5">Tip / service</label>
            <div className="flex gap-2">
              {TIP_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipPercent(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium pressable ${
                    tipPercent === t ? 'theme-pill-active' : 'theme-pill'
                  }`}
                >
                  {t === 0 ? 'None' : `${t}%`}
                </button>
              ))}
            </div>
            {tipPercent > 0 && (
              <p className="text-xs theme-muted mt-2">
                Total with tip: <span className="theme-heading num">{formatSGD(grandTotal)}</span>
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="theme-label">People</label>
              <button type="button" onClick={addPerson} className="text-xs theme-accent-text font-medium">
                + Add
              </button>
            </div>
            <div className="space-y-2">
              {people.map((person, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={person}
                    onChange={(e) => updatePerson(i, e.target.value)}
                    placeholder={i === 0 ? 'You' : 'Friend name'}
                    disabled={i === 0 && person === YOU}
                    className="flex-1 px-4 py-2.5 theme-input"
                  />
                  {i > 0 && people.length > 2 && (
                    <button type="button" onClick={() => removePerson(i)} className="w-10 theme-btn-ghost flex items-center justify-center" aria-label="Remove">
                      <Icon name="x" size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block theme-label mb-1.5">Who paid?</label>
            <div className="flex flex-wrap gap-2">
              {names.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setPayer(name)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium pressable ${
                    payer === name ? 'theme-pill-active' : 'theme-pill'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="theme-label">Split</label>
              {!customMode ? (
                <button type="button" onClick={enableCustom} className="text-xs theme-accent-text font-medium">
                  Custom amounts
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCustomMode(false)
                    setCustomAmounts([])
                  }}
                  className="text-xs theme-accent-text font-medium"
                >
                  Equal split
                </button>
              )}
            </div>
            {names.length > 0 && grandTotal > 0 && (
              <div className="glass-card p-3 space-y-2">
                {names.map((name, i) => (
                  <div key={name + i} className="flex items-center justify-between gap-3 text-sm">
                    <span className="theme-heading truncate">{name}{name === payer ? ' · paid' : ''}</span>
                    {customMode ? (
                      <div className="relative w-28">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs theme-muted">S$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={customAmounts[i] ?? ''}
                          onChange={(e) => {
                            const next = [...customAmounts]
                            next[i] = e.target.value
                            setCustomAmounts(next)
                          }}
                          className="w-full pl-7 pr-2 py-1.5 theme-input text-sm num"
                        />
                      </div>
                    ) : (
                      <span className="font-semibold num theme-heading">{formatSGD(previewShares[i] || 0)}</span>
                    )}
                  </div>
                ))}
                {customMode && (
                  <p className={`text-xs ${Math.abs(customSum - grandTotal) > 0.01 ? 'text-[var(--theme-error)]' : 'theme-muted'}`}>
                    Sum {formatSGD(customSum)} / {formatSGD(grandTotal)}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block theme-label mb-1.5">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-3 theme-input" />
          </div>

          <div>
            <label className="block theme-label mb-1.5">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" className="w-full px-4 py-3 theme-input" />
          </div>

          <label className="flex items-start gap-3 glass-card p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={logExpense}
              onChange={(e) => setLogExpense(e.target.checked)}
              className="mt-1"
            />
            <span>
              <span className="block text-sm font-medium theme-heading">Add my share to expenses</span>
              <span className="text-xs theme-muted">Logs only your portion so the full bill isn’t double-counted</span>
            </span>
          </label>

          {logExpense && categories.length > 0 && (
            <div>
              <label className="block theme-label mb-1.5">Expense category</label>
              <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />
            </div>
          )}

          {error && <p className="text-sm text-[var(--theme-error)]">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full py-3.5 theme-btn-primary disabled:opacity-50">
            {submitting ? 'Saving…' : 'Create split'}
          </button>
        </form>
      </div>
    </div>
  )
}
