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
        <h2 className="text-lg font-semibold text-white">Income Sources</h2>
        <span className="text-white/50 text-sm">{expanded ? '▼' : '▶'}</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/10">
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Primary salary</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-accent-green">{formatSGD(primaryIncome)}</span>
                <button
                  onClick={onEditPrimary}
                  className="text-xs text-white/50 hover:text-white px-2 py-1"
                >
                  edit
                </button>
              </div>
            </div>

            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between">
                {editingId === source.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="w-24 px-2 py-1 text-sm rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                    <button onClick={() => saveEdit(source.id)} className="text-xs text-accent-green">
                      save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-white/80">+ {source.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{formatSGD(source.amount)}</span>
                      <button
                        onClick={() => startEdit(source)}
                        className="text-xs text-white/50 hover:text-white px-1"
                      >
                        edit
                      </button>
                      <button
                        onClick={() => onDeleteSource(source.id)}
                        className="text-xs text-accent-red hover:text-red-300 px-1"
                      >
                        delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3 flex items-center justify-between mb-4">
            <span className="font-medium text-white/80">Total income</span>
            <span className="text-xl font-bold gradient-text">{formatSGD(totalIncome)}</span>
          </div>

          {showAdd ? (
            <form onSubmit={handleAdd} className="space-y-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Source name (e.g. Freelance)"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/30"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Amount"
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-green/20 text-accent-green rounded-lg text-sm font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-3 py-2 text-white/50 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full py-2.5 text-sm font-medium text-accent-blue hover:bg-white/5 rounded-xl transition-colors"
            >
              + Add income source
            </button>
          )}
        </div>
      )}
    </div>
  )
}
