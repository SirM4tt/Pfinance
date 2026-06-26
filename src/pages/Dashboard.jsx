import { useState } from 'react'
import TopBar from '../components/layout/TopBar'
import BalanceHero from '../components/dashboard/BalanceHero'
import DonutChart from '../components/dashboard/DonutChart'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import RecentExpenses from '../components/dashboard/RecentExpenses'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import AddExpenseFab from '../components/expenses/AddExpenseFab'
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
    <div className="app-shell pb-28">
      <div className="header-gradient pb-2">
        <TopBar monthKey={monthKey} onMonthChange={onMonthChange} variant="hero" />
        <BalanceHero
          income={income}
          totalSpent={totalSpent}
          monthLabel={formatMonthLabel(monthKey)}
        />
      </div>

      <div className="bg-[#0f0f1a]">
        <DonutChart data={chartData} />
        <BudgetProgress categories={categories} expenses={expenses} limit={3} />
        <RecentExpenses expenses={expenses} onViewAll={onViewAllExpenses} />
      </div>

      <AddExpenseFab onClick={() => setShowAddModal(true)} />

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSubmit={onAddExpense}
      />
    </div>
  )
}
