import { useState } from 'react'
import SetIncomeModal from '../components/income/SetIncomeModal'
import { formatSGD } from '../lib/utils'

export default function Settings({
  user,
  income,
  categories,
  onSetIncome,
  onAddCategory,
  onDeleteCategory,
  onSignOut,
}) {
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatIcon, setNewCatIcon] = useState('💳')
  const [newCatColor, setNewCatColor] = useState('#818cf8')

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name || user?.email

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    await onAddCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      color: newCatColor,
    })
    setNewCatName('')
    setNewCatIcon('💳')
    setNewCatColor('#818cf8')
    setShowAddCategory(false)
  }

  return (
    <div className="pb-20">
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center text-xl font-bold">
              {displayName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          <button
            onClick={() => setShowIncomeModal(true)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="text-left">
              <p className="font-medium text-gray-900">Monthly income</p>
              <p className="text-sm text-gray-400">Set your income for this month</p>
            </div>
            <span className="font-semibold text-navy">{formatSGD(income)}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm mb-4">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="font-medium text-gray-900">Categories</p>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-sm text-navy font-medium"
            >
              {showAddCategory ? 'Cancel' : '+ Add'}
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleAddCategory} className="px-5 py-4 border-b border-gray-100 space-y-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="w-16 px-2 py-2 rounded-lg border border-gray-200 text-center"
                  maxLength={2}
                />
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <button
                  type="submit"
                  className="flex-1 py-2 bg-navy text-white rounded-lg text-sm font-medium"
                >
                  Add category
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${cat.color}20` }}
                  >
                    {cat.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${cat.name}"?`)) onDeleteCategory(cat.id)
                  }}
                  className="text-xs text-red-400 hover:text-red-600 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onSignOut}
          className="w-full py-3.5 bg-red-50 text-red-600 font-semibold rounded-2xl hover:bg-red-100 transition-colors"
        >
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
