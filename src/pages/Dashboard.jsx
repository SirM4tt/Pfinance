import { useMemo, useState } from 'react'
import TopBar from '../components/layout/TopBar'
import BalanceHero from '../components/dashboard/BalanceHero'
import DonutChart from '../components/dashboard/DonutChart'
import BudgetProgress from '../components/dashboard/BudgetProgress'
import RecentExpenses from '../components/dashboard/RecentExpenses'
import WeeklyDigestCard from '../components/dashboard/WeeklyDigestCard'
import StreakBadge from '../components/dashboard/StreakBadge'
import MonthEndModal from '../components/dashboard/MonthEndModal'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import AddExpenseFab from '../components/expenses/AddExpenseFab'
import { formatMonthLabel } from '../lib/utils'
import { generateDigest, isSunday } from '../lib/weeklyDigest'
import { getPrevMonthKey } from '../lib/streaks'

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
  stats,
  onDismissDigest,
  onStartNewMonth,
  prevMonthSummary,
  showMonthEnd,
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showStreakInfo, setShowStreakInfo] = useState(false)

  const today = new Date()
  const digest = useMemo(() => generateDigest(expenses, income, today), [expenses, income])

  const showDigest =
    isSunday(today) &&
    stats?.last_digest_shown !== today.toISOString().split('T')[0]

  const handleAddExpense = async (data) => {
    await onAddExpense(data)
    setShowAddModal(false)
  }

  return (
    <div className="app-shell pb-28">
      {showDigest && (
        <WeeklyDigestCard digest={digest} onDismiss={onDismissDigest} />
      )}

      {showMonthEnd && prevMonthSummary && (
        <MonthEndModal
          monthKey={getPrevMonthKey(monthKey)}
          income={prevMonthSummary.income}
          totalSpent={prevMonthSummary.totalSpent}
          streak={stats?.current_streak ?? 0}
          onStartNewMonth={onStartNewMonth}
        />
      )}

      <div className="header-gradient pb-2">
        <TopBar monthKey={monthKey} onMonthChange={onMonthChange} variant="hero" />
        <BalanceHero
          income={income}
          totalSpent={totalSpent}
          monthLabel={formatMonthLabel(monthKey)}
        />
      </div>

      <StreakBadge
        streak={stats?.current_streak}
        onTap={() => setShowStreakInfo((v) => !v)}
      />

      {showStreakInfo && stats?.current_streak > 0 && (
        <div className="mx-4 mb-2 glass-card p-4 text-sm text-[var(--theme-text-muted)]">
          <p>🔥 {stats.current_streak} months under budget</p>
          {stats.longest_streak > stats.current_streak && (
            <p className="mt-1">Best streak: {stats.longest_streak} months</p>
          )}
          {stats.best_month && <p className="mt-1">Best month: {formatMonthLabel(stats.best_month)}</p>}
        </div>
      )}

      <div className="bg-[var(--theme-primary)]">
        <DonutChart data={chartData} />
        <BudgetProgress categories={categories} expenses={expenses} limit={3} />
        <RecentExpenses expenses={expenses} onViewAll={onViewAllExpenses} />
      </div>

      <AddExpenseFab onClick={() => setShowAddModal(true)} />

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSubmit={handleAddExpense}
      />
    </div>
  )
}
