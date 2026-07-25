import { useState } from 'react'
import SetIncomeModal from '../components/income/SetIncomeModal'
import ThemePicker from '../components/settings/ThemePicker'
import CategoryEditor from '../components/settings/CategoryEditor'
import { formatSGD } from '../lib/utils'
import Icon from '../components/icons/Icon'

export default function Settings({
  user,
  income,
  totalIncome,
  categories,
  themeId,
  paynowId = '',
  onSetIncome,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onThemeChange,
  onSetPaynow,
  onSignOut,
}) {
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [editingPaynow, setEditingPaynow] = useState(false)
  const [paynowDraft, setPaynowDraft] = useState(paynowId || '')
  const [savingPaynow, setSavingPaynow] = useState(false)

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email

  const savePaynow = async () => {
    setSavingPaynow(true)
    try {
      await onSetPaynow?.(paynowDraft)
      setEditingPaynow(false)
    } finally {
      setSavingPaynow(false)
    }
  }

  return (
    <div className="pb-28">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold font-display text-[var(--theme-text-on-primary)] mb-6 reveal">Settings</h1>

        <div className="glass-card p-5 mb-4 flex items-center gap-4 reveal" style={{ '--delay': '0.05s' }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full ring-2 ring-white/20" />
          ) : (
            <div
              className="w-14 h-14 rounded-full text-[var(--theme-text-on-primary)] flex items-center justify-center text-xl font-bold"
              style={{ background: 'var(--theme-hero-gradient)' }}
            >
              {displayName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-semibold text-[var(--theme-text-on-primary)]">{displayName}</p>
            <p className="text-sm text-[var(--theme-text-muted)]">{user?.email}</p>
          </div>
        </div>

        <div className="glass-card mb-4 overflow-hidden reveal" style={{ '--delay': '0.1s' }}>
          <button
            onClick={() => setShowIncomeModal(true)}
            className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:opacity-90"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="icon-chip w-10 h-10 theme-accent-text" style={{ background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)' }}>
                <Icon name="coins" size={19} />
              </span>
              <div>
                <p className="font-medium text-[var(--theme-text-on-primary)]">Monthly income</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Primary salary for this month</p>
              </div>
            </div>
            <span className="font-semibold text-[var(--theme-accent)] num">{formatSGD(income)}</span>
          </button>
          {totalIncome !== income && (
            <div className="px-5 py-3 border-t theme-divider flex justify-between">
              <span className="text-sm text-[var(--theme-text-muted)]">Total (incl. sources)</span>
              <span className="text-sm font-semibold text-[var(--theme-accent)] num">{formatSGD(totalIncome)}</span>
            </div>
          )}
        </div>

        <div className="glass-card mb-4 overflow-hidden reveal" style={{ '--delay': '0.12s' }}>
          {!editingPaynow ? (
            <button
              type="button"
              onClick={() => {
                setPaynowDraft(paynowId || '')
                setEditingPaynow(true)
              }}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:opacity-90"
            >
              <div className="flex items-center gap-3 text-left">
                <span className="icon-chip w-10 h-10 theme-accent-text" style={{ background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)' }}>
                  <Icon name="smartphone" size={19} />
                </span>
                <div>
                  <p className="font-medium text-[var(--theme-text-on-primary)]">PayNow</p>
                  <p className="text-sm text-[var(--theme-text-muted)]">Shown when you share a split</p>
                </div>
              </div>
              <span className="text-sm font-medium theme-muted truncate max-w-[40%]">
                {paynowId || 'Add'}
              </span>
            </button>
          ) : (
            <div className="px-5 py-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="icon-chip w-10 h-10 theme-accent-text" style={{ background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)' }}>
                  <Icon name="smartphone" size={19} />
                </span>
                <div>
                  <p className="font-medium text-[var(--theme-text-on-primary)]">PayNow ID</p>
                  <p className="text-xs text-[var(--theme-text-muted)]">Mobile or NRIC/FIN proxy</p>
                </div>
              </div>
              <input
                type="text"
                value={paynowDraft}
                onChange={(e) => setPaynowDraft(e.target.value)}
                placeholder="+65 9xxx xxxx"
                className="w-full px-4 py-3 theme-input"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPaynow(false)}
                  className="flex-1 py-2.5 rounded-xl theme-btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={savePaynow}
                  disabled={savingPaynow}
                  className="flex-1 py-2.5 rounded-xl theme-btn-primary text-sm disabled:opacity-50"
                >
                  {savingPaynow ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </div>

        <ThemePicker currentTheme={themeId} onSelect={onThemeChange} />

        <CategoryEditor
          categories={categories}
          onUpdate={onUpdateCategory}
          onDelete={onDeleteCategory}
          onReorder={onReorderCategories}
          onAdd={onAddCategory}
        />

        <button
          onClick={onSignOut}
          className="w-full py-3.5 font-semibold rounded-2xl transition-colors theme-muted border theme-divider hover:opacity-80 pressable flex items-center justify-center gap-2"
        >
          <Icon name="log-out" size={17} />
          Sign out
        </button>
      </div>

      <SetIncomeModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        currentIncome={income}
        onSubmit={onSetIncome}
      />
    </div>
  )
}
