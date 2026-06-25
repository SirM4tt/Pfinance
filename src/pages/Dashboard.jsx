import { useState } from 'react'
import TopBar from '../components/layout/TopBar'
import BalanceHero from '../components/dashboard/BalanceHero'
import DonutChart from '../components/dashboard/DonutChart'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import RecentExpenses from '../components/dashboard/RecentExpenses'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import { formatMonthLabel } from '../lib/utils'

export default function Dashboard({
  monthKey,
  onMonthChange,
  income,
  totalSpent,
  expenses,
  chartData,
  categories,
  onAddExpense,
  onViewAllExpenses,
}) {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="pb-20">
      <TopBar monthKey={monthKey} onMonthChange={onMonthChange} />
      <BalanceHero
        income={income}
        totalSpent={totalSpent}
        monthLabel={formatMonthLabel(monthKey)}
      />
      <DonutChart data={chartData} />
      <BudgetProgress categories={categories} expenses={expenses} limit={3} />
      <RecentExpenses expenses={expenses} onViewAll={onViewAllExpenses} />

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-navy text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-navy/90 transition-colors z-30"
        aria-label="Add expense"
      >
        +
      </button>

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSubmit={onAddExpense}
      />
    </div>
  )
}
