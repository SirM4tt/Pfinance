import { useState } from 'react'
import { formatSGD } from '../../lib/utils'

export default function IncomeSourcesSection({
  primaryIncome,
  sources,
  totalIncome,
  onAddSource,
  onUpdateSource,
  onDeleteSource,
  onEditPrimary,
}) {
  const [expanded, setExpanded] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editAmount, setEditAmount] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim() || !newAmount) return
    await onAddSource({ name: newName.trim(), amount: Number(newAmount) })
    setNewName('')
    setNewAmount('')
    setShowAdd(false)
  }

  const startEdit = (source) => {
    setEditingId(source.id)
    setEditName(source.name)
    setEditAmount(source.amount.toString())
  }

  const saveEdit = async (id) => {
    await onUpdateSource(id, { name: editName.trim(), amount: Number(editAmount) })
    setEditingId(null)
  }

  return (
    <div className="mx-4 mb-6 glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <h2 className="text-lg font-semibold theme-heading">Income Sources</h2>
        <span className="theme-muted text-sm">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t theme-divider">
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between">
              <span className="theme-heading text-sm">Primary salary</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold theme-accent-text">{formatSGD(primaryIncome)}</span>
                <button onClick={onEditPrimary} className="text-xs theme-muted hover:theme-heading px-2 py-1">
                  edit
                </button>
              </div>
            </div>

            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                {editingId === source.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="flex-1 px-2 py-1 text-sm theme-input" />
                    <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="w-24 px-2 py-1 text-sm theme-input" />
                    <button onClick={() => saveEdit(source.id)} className="text-xs theme-accent-text">save</button>
                  </div>
                ) : (
                  <>
                    <span className="theme-heading text-sm">+ {source.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold theme-heading">{formatSGD(source.amount)}</span>
                      <button onClick={() => startEdit(source)} className="text-xs theme-muted hover:theme-heading px-1">edit</button>
                      <button onClick={() => onDeleteSource(source.id)} className="text-xs text-[var(--theme-error)] px-1">delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="border-t theme-divider pt-3 flex items-center justify-between mb-4">
            <span className="font-medium theme-heading">Total income</span>
            <span className="text-xl font-bold gradient-text">{formatSGD(totalIncome)}</span>
          </div>

          {showAdd ? (
            <form onSubmit={handleAdd} className="space-y-2">
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Source name (e.g. Freelance)" className="w-full px-3 py-2 theme-input text-sm" />
              <div className="flex gap-2">
                <input type="number" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} placeholder="Amount" className="flex-1 px-3 py-2 theme-input text-sm" />
                <button type="submit" className="px-4 py-2 theme-btn-primary text-sm">Add</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-2 theme-muted text-sm">Cancel</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowAdd(true)} className="w-full py-2.5 text-sm font-medium theme-accent-text hover:opacity-80 rounded-xl transition-colors">
              + Add income source
            </button>
          )}
        </div>
      )}
    </div>
  )
}
