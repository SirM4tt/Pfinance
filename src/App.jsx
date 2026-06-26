import { useState, useCallback } from 'react'
import { useAuth } from './hooks/useAuth'
import { useFinanceData } from './hooks/useFinanceData'
import { useSplurge } from './hooks/useSplurge'
import { getMonthKey } from './lib/utils'
import LoginScreen from './components/auth/LoginScreen'
import WelcomeIncomeModal from './components/income/WelcomeIncomeModal'
import BottomNav from './components/layout/BottomNav'
import SupabaseStatus from './components/layout/SupabaseStatus'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budget from './pages/Budget'
import Splurge from './pages/Splurge'
import Settings from './pages/Settings'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [monthKey, setMonthKey] = useState(getMonthKey())

  const userId = user?.id
  const dataEnabled = !!userId && !authLoading

  const finance = useFinanceData(userId, monthKey, dataEnabled)
  const splurge = useSplurge(userId, dataEnabled && activeTab === 'splurge')

  const showWelcomeIncome = dataEnabled && !finance.loading && !finance.hasIncomeRecord

  const handleViewAllExpenses = useCallback(() => setActiveTab('expenses'), [])
  const handleEditPrimary = useCallback(() => setActiveTab('settings'), [])

  if (authLoading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-white/70 font-medium">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <div className="app-shell max-w-lg mx-auto relative">
      {!showWelcomeIncome && (
        <SupabaseStatus
          error={finance.error}
          loading={finance.loading}
          onRetry={finance.refresh}
        />
      )}

      {showWelcomeIncome && (
        <WelcomeIncomeModal isOpen monthKey={monthKey} onSubmit={finance.setIncome} />
      )}

      {!showWelcomeIncome && activeTab === 'dashboard' && (
        <Dashboard
          monthKey={monthKey}
          onMonthChange={setMonthKey}
          income={finance.totalIncome}
          totalSpent={finance.totalSpent}
          expenses={finance.expenses}
          chartData={finance.chartData}
          categories={finance.categories}
          onAddExpense={finance.addExpense}
          onViewAllExpenses={handleViewAllExpenses}
        />
      )}

      {!showWelcomeIncome && activeTab === 'expenses' && (
        <Expenses
          monthKey={monthKey}
          onMonthChange={setMonthKey}
          expenses={finance.expenses}
          categories={finance.categories}
          onAddExpense={finance.addExpense}
          onDeleteExpense={finance.deleteExpense}
        />
      )}

      {!showWelcomeIncome && activeTab === 'budget' && (
        <Budget
          monthKey={monthKey}
          onMonthChange={setMonthKey}
          categories={finance.categories}
          expenses={finance.expenses}
          primaryIncome={finance.income}
          sources={finance.sources}
          totalIncome={finance.totalIncome}
          onSetBudgetLimit={finance.setBudgetLimit}
          onAddSource={finance.addSource}
          onUpdateSource={finance.updateSource}
          onDeleteSource={finance.deleteSource}
          onEditPrimary={handleEditPrimary}
        />
      )}

      {!showWelcomeIncome && activeTab === 'splurge' && (
        <Splurge
          goals={splurge.goals}
          loading={splurge.loading}
          onAddGoal={splurge.addGoal}
          onUpdateGoal={splurge.updateGoal}
          onDeleteGoal={splurge.deleteGoal}
          onAddContribution={splurge.addContribution}
        />
      )}

      {!showWelcomeIncome && activeTab === 'settings' && (
        <Settings
          user={user}
          income={finance.income}
          totalIncome={finance.totalIncome}
          categories={finance.categories}
          onSetIncome={finance.setIncome}
          onAddCategory={finance.addCategory}
          onDeleteCategory={finance.deleteCategory}
          onSignOut={signOut}
        />
      )}

      {!showWelcomeIncome && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  )
}
