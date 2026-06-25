import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useCategories } from './hooks/useCategories'
import { useExpenses } from './hooks/useExpenses'
import { useIncome } from './hooks/useIncome'
import { getMonthKey } from './lib/utils'
import LoginScreen from './components/auth/LoginScreen'
import BottomNav from './components/layout/BottomNav'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Budget from './pages/Budget'
import Settings from './pages/Settings'

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [monthKey, setMonthKey] = useState(getMonthKey())

  const { categories, addCategory, deleteCategory, setBudgetLimit } = useCategories(user)
  const { income, setIncome } = useIncome(user, monthKey)
  const { expenses, addExpense, deleteExpense, totalSpent, chartData } = useExpenses(user, monthKey)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-navy font-medium">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  const handleViewAllExpenses = () => setActiveTab('expenses')

  return (
    <div className="min-h-screen bg-gray-50 max-w-lg mx-auto relative">
      {activeTab === 'dashboard' && (
        <Dashboard
          monthKey={monthKey}
          onMonthChange={setMonthKey}
          income={income}
          totalSpent={totalSpent}
          expenses={expenses}
          chartData={chartData}
          categories={categories}
          onAddExpense={addExpense}
          onViewAllExpenses={handleViewAllExpenses}
        />
      )}

      {activeTab === 'expenses' && (
        <Expenses
          monthKey={monthKey}
          onMonthChange={setMonthKey}
          expenses={expenses}
          categories={categories}
          onAddExpense={addExpense}
          onDeleteExpense={deleteExpense}
        />
      )}

      {activeTab === 'budget' && (
        <Budget
          monthKey={monthKey}
          onMonthChange={setMonthKey}
          categories={categories}
          expenses={expenses}
          onSetBudgetLimit={setBudgetLimit}
        />
      )}

      {activeTab === 'settings' && (
        <Settings
          user={user}
          income={income}
          categories={categories}
          onSetIncome={setIncome}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onSignOut={signOut}
        />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
