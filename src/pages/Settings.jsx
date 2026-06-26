import { useState } from 'react'
import SetIncomeModal from '../components/income/SetIncomeModal'
import ThemePicker from '../components/settings/ThemePicker'
import CategoryEditor from '../components/settings/CategoryEditor'
import { formatSGD } from '../lib/utils'

export default function Settings({
  user,
  income,
  totalIncome,
  categories,
  themeId,
  onSetIncome,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onThemeChange,
  onSignOut,
}) {
  const [showIncomeModal, setShowIncomeModal] = useState(false)

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email

  return (
    <div className="pb-28">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-[var(--theme-text-on-primary)] mb-6">Settings</h1>

        <div className="glass-card p-5 mb-4 flex items-center gap-4">
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

        <div className="glass-card mb-4 overflow-hidden">
          <button
            onClick={() => setShowIncomeModal(true)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-[var(--theme-text-on-primary)]">💰 Monthly income</p>
              <p className="text-sm text-[var(--theme-text-muted)]">Primary salary for this month</p>
            </div>
            <span className="font-semibold text-[var(--theme-accent)]">{formatSGD(income)}</span>
          </button>
          {totalIncome !== income && (
            <div className="px-5 py-3 border-t border-white/10 flex justify-between">
              <span className="text-sm text-[var(--theme-text-muted)]">Total (incl. sources)</span>
              <span className="text-sm font-semibold text-[var(--theme-accent)]">{formatSGD(totalIncome)}</span>
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
          className="w-full py-3.5 font-semibold rounded-2xl transition-colors text-[var(--theme-text-muted)] border border-white/10 hover:bg-white/5"
        >
          🚪 Sign out
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
