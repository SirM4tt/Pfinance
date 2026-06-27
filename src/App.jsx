import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAuth } from './hooks/useAuth'
import { useFinanceData } from './hooks/useFinanceData'
import { useSplurge } from './hooks/useSplurge'
import { useUserStats } from './hooks/useUserStats'
import { getMonthKey } from './lib/utils'
import { checkMonthEnd, getPrevMonthKey, isFirstOfMonth } from './lib/streaks'
import { applyTheme } from './lib/themes'
import LoginScreen from './components/auth/LoginScreen'
import WelcomeIncomeModal from './components/income/WelcomeIncomeModal'
import BottomNav from './components/layout/BottomNav'
import SupabaseStatus from './components/layout/SupabaseStatus'
import { ToastProvider, useToast } from './components/layout/Toast'
import ThemeProvider from './components/layout/ThemeProvider'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budget from './pages/Budget'
import Splurge from './pages/Splurge'
import Settings from './pages/Settings'

function AppContent() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [monthKey, setMonthKey] = useState(getMonthKey())
  const [prevMonthSummary, setPrevMonthSummary] = useState(null)
  const [monthEndDismissed, setMonthEndDismissed] = useState(false)

  const userId = user?.id
  const dataEnabled = !!userId && !authLoading

  const finance = useFinanceData(userId, monthKey, dataEnabled)
  const splurge = useSplurge(userId, dataEnabled && activeTab === 'splurge')
  const userStats = useUserStats(userId, dataEnabled)

  const showWelcomeIncome = dataEnabled && !finance.loading && !finance.hasIncomeRecord

  const showMonthEnd = useMemo(() => {
    if (monthEndDismissed || !isFirstOfMonth()) return false
    if (!userStats.stats?.last_checked_month) return true
    return userStats.stats.last_checked_month !== monthKey
  }, [monthEndDismissed, userStats.stats, monthKey])

  useEffect(() => {
    if (!showMonthEnd || !userId) return
    const prevKey = getPrevMonthKey(monthKey)
    finance.fetchMonthSummary(prevKey).then(setPrevMonthSummary).catch(console.error)
  }, [showMonthEnd, userId, monthKey])

  const handleViewAllExpenses = useCallback(() => setActiveTab('expenses'), [])
  const handleEditPrimary = useCallback(() => setActiveTab('settings'), [])

  const handleAddExpense = async (data) => {
    const wasEmpty = finance.expenses.length === 0
    await finance.addExpense(data)
    const newTotalSpent = finance.totalSpent + Number(data.amount)
    const budgetPercent = finance.totalIncome > 0 ? newTotalSpent / finance.totalIncome : 1

    if (wasEmpty) {
      showToast('Good start — keep it going')
    } else if (
      budgetPercent < 0.8 &&
      (userStats.stats?.celebration_count ?? 0) < 3
    ) {
      showToast('Still on track 👍')
      await userStats.incrementCelebration()
    }
  }

  const handleDismissDigest = async () => {
    await userStats.dismissDigest()
  }

  const handleStartNewMonth = async () => {
    const prevKey = getPrevMonthKey(monthKey)
    const summary = prevMonthSummary || (await finance.fetchMonthSummary(prevKey))
    const result = checkMonthEnd({
      totalSpent: summary.totalSpent,
      totalIncome: summary.income,
      currentStreak: userStats.stats?.current_streak ?? 0,
      longestStreak: userStats.stats?.longest_streak ?? 0,
      bestMonth: userStats.stats?.best_month,
      prevMonthKey: prevKey,
      monthKey,
    })
    await userStats.updateStats({
      current_streak: result.currentStreak,
      longest_streak: result.longestStreak,
      best_month: result.bestMonth,
      last_checked_month: monthKey,
      celebration_count: 0,
    })
    setMonthEndDismissed(true)
    if (!finance.hasIncomeRecord) {
      // WelcomeIncomeModal will show automatically
    }
  }

  const handleThemeChange = async (themeId) => {
    applyTheme(themeId)
    await userStats.setTheme(themeId)
    showToast('Theme updated')
  }

  if (authLoading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="text-[var(--theme-text-muted)] font-medium">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <ThemeProvider themeId={userStats.stats?.theme_id || 'navy'}>
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
            onAddExpense={handleAddExpense}
            onViewAllExpenses={handleViewAllExpenses}
            stats={userStats.stats}
            onDismissDigest={handleDismissDigest}
            onStartNewMonth={handleStartNewMonth}
            prevMonthSummary={prevMonthSummary}
            showMonthEnd={showMonthEnd && !!prevMonthSummary}
          />
        )}

        {!showWelcomeIncome && activeTab === 'expenses' && (
          <Expenses
            monthKey={monthKey}
            onMonthChange={setMonthKey}
            expenses={finance.expenses}
            categories={finance.categories}
            onAddExpense={handleAddExpense}
            onUpdateExpense={finance.updateExpense}
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
            themeId={userStats.stats?.theme_id || 'navy'}
            onSetIncome={finance.setIncome}
            onAddCategory={finance.addCategory}
            onUpdateCategory={finance.updateCategory}
            onDeleteCategory={finance.deleteCategory}
            onReorderCategories={finance.reorderCategories}
            onThemeChange={handleThemeChange}
            onSignOut={signOut}
          />
        )}

        {!showWelcomeIncome && (
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}
