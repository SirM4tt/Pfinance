import { useMemo, useState } from 'react'
import CreateSplitModal from '../components/split/CreateSplitModal'
import SplitCard from '../components/split/SplitCard'
import { formatSGD } from '../lib/utils'
import { netBalances } from '../lib/splitMath'
import Icon from '../components/icons/Icon'

export default function Split({
  splits,
  loading,
  categories,
  paynowId,
  onAddSplit,
  onSettlePerson,
  onSettleAll,
  onDeleteSplit,
  onToast,
}) {
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('open') // open | settled | all

  const balances = useMemo(() => netBalances(splits), [splits])

  const filtered = useMemo(() => {
    if (filter === 'open') return splits.filter((s) => !s.settled)
    if (filter === 'settled') return splits.filter((s) => s.settled)
    return splits
  }, [splits, filter])

  return (
    <div className="app-shell pb-28">
      <div className="header-gradient px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold font-display text-[var(--theme-hero-text)] flex items-center gap-2">
          <Icon name="users" size={22} className="theme-accent-text" />
          Split
        </h1>
        <p className="text-[var(--theme-hero-text-muted)] text-sm mt-1">Split bills. Track who owes what.</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {balances.length > 0 && (
          <div className="glass-card p-4 reveal">
            <p className="text-xs uppercase tracking-wide theme-muted mb-3">Open balances</p>
            <div className="space-y-2">
              {balances.map((b) => (
                <div key={b.name} className="flex items-center justify-between text-sm">
                  <span className="theme-heading">{b.name}</span>
                  <span className={`font-semibold num ${b.amount > 0 ? 'theme-accent-text' : 'text-[var(--theme-warning)]'}`}>
                    {b.amount > 0 ? `owes you ${formatSGD(b.amount)}` : `you owe ${formatSGD(Math.abs(b.amount))}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {[
            { id: 'open', label: 'Open' },
            { id: 'settled', label: 'Settled' },
            { id: 'all', label: 'All' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium pressable ${
                filter === f.id ? 'theme-pill-active' : 'theme-pill'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center theme-muted py-12">Loading splits…</p>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-8 text-center reveal">
            <span
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 theme-accent-text"
              style={{ background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)' }}
            >
              <Icon name="users" size={26} />
            </span>
            <p className="theme-heading mb-1">
              {filter === 'open' ? 'No open splits' : filter === 'settled' ? 'No settled splits yet' : 'No splits yet'}
            </p>
            <p className="text-sm theme-muted">
              Create a split when someone pays for the group — track who still owes.
            </p>
          </div>
        ) : (
          filtered.map((split, i) => (
            <SplitCard
              key={split.id}
              split={split}
              paynowId={paynowId}
              index={i}
              onSettlePerson={onSettlePerson}
              onSettleAll={onSettleAll}
              onDelete={onDeleteSplit}
              onShare={onToast}
            />
          ))
        )}
      </div>

      <button
        onClick={() => setShowCreate(true)}
        className="fab-button fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 flex items-center gap-2 pl-4 pr-5 h-[52px] rounded-full font-semibold text-sm z-50"
      >
        <span className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: 'rgba(0,0,0,0.14)' }}>
          <Icon name="plus" size={16} strokeWidth={2.6} />
        </span>
        New split
      </button>

      <CreateSplitModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={onAddSplit}
        categories={categories}
      />
    </div>
  )
}
