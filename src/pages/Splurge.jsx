import { useState } from 'react'
import SplurgeGoalCard from '../components/splurge/SplurgeGoalCard'
import AddGoalModal from '../components/splurge/AddGoalModal'
import AddContributionModal from '../components/splurge/AddContributionModal'

export default function Splurge({ goals, loading, onAddGoal, onUpdateGoal, onDeleteGoal, onAddContribution }) {
  const [showGoalModal, setShowGoalModal] = useState(false)
  const [showContribModal, setShowContribModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [contribGoal, setContribGoal] = useState(null)

  const handleEdit = (goal) => {
    setEditingGoal(goal)
    setShowGoalModal(true)
  }

  const handleAddContribution = (goal) => {
    setContribGoal(goal)
    setShowContribModal(true)
  }

  const handleGoalSubmit = async (data) => {
    if (editingGoal) {
      await onUpdateGoal(editingGoal.id, data)
    } else {
      await onAddGoal(data)
    }
    setEditingGoal(null)
  }

  const handleContribSubmit = async (data) => {
    await onAddContribution(contribGoal.id, data)
    setContribGoal(null)
  }

  return (
    <div className="app-shell pb-28">
      <div className="header-gradient px-4 pt-6 pb-8">
        <h1 className="text-2xl font-bold text-[var(--theme-hero-text)]">✨ Splurge Goals</h1>
        <p className="text-[var(--theme-hero-text-muted)] text-sm mt-1">Your wishlist, made achievable</p>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {loading ? (
          <p className="text-center theme-muted py-12">Loading goals...</p>
        ) : goals.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-4xl mb-3">✨</p>
            <p className="theme-heading mb-1">No splurge goals yet</p>
            <p className="text-sm theme-muted">Create your first Splurge goal to start saving for something exciting</p>
          </div>
        ) : (
          goals.map((goal) => (
            <SplurgeGoalCard
              key={goal.id}
              goal={goal}
              onAddContribution={handleAddContribution}
              onEdit={handleEdit}
              onDelete={onDeleteGoal}
            />
          ))
        )}
      </div>

      <button
        onClick={() => {
          setEditingGoal(null)
          setShowGoalModal(true)
        }}
        className="fab-button fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 h-[52px] rounded-full font-semibold text-sm z-50 active:scale-95 transition-transform"
      >
        + New Splurge Goal
      </button>

      <AddGoalModal
        isOpen={showGoalModal}
        onClose={() => {
          setShowGoalModal(false)
          setEditingGoal(null)
        }}
        onSubmit={handleGoalSubmit}
        editGoal={editingGoal}
      />

      <AddContributionModal
        isOpen={showContribModal}
        onClose={() => {
          setShowContribModal(false)
          setContribGoal(null)
        }}
        goal={contribGoal}
        onSubmit={handleContribSubmit}
      />
    </div>
  )
}
