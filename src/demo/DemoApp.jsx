// UI demo harness — renders the real pages with mock data, no Supabase needed.
// Drive it with ?tab=dashboard|expenses|budget|splurge|settings|login&theme=navy|gold|pastel|dark
import { useState } from 'react'
import BottomNav from '../components/layout/BottomNav'
import { ToastProvider } from '../components/layout/Toast'
import ThemeProvider from '../components/layout/ThemeProvider'
import LoginScreen from '../components/auth/LoginScreen'
import Dashboard from '../pages/Dashboard'
import Expenses from '../pages/Expenses'
import Budget from '../pages/Budget'
import Splurge from '../pages/Splurge'
import Settings from '../pages/Settings'
import * as mock from './mockData'

const params = new URLSearchParams(window.location.search)
const initialTab = params.get('tab') || 'dashboard'
const themeId = params.get('theme') || 'navy'

export default function DemoApp() {
  const [activeTab, setActiveTab] = useState(initialTab)

  if (activeTab === 'login') {
    return (
      <ThemeProvider themeId={themeId}>
        <ToastProvider>
          <LoginScreen />
        </ToastProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider themeId={themeId}>
      <ToastProvider>
        <div className="app-shell max-w-lg mx-auto relative">
          {activeTab === 'dashboard' && (
            <Dashboard
              monthKey={mock.monthKey}
              onMonthChange={mock.noop}
              income={mock.income}
              totalSpent={mock.totalSpent}
              expenses={mock.expenses}
              chartData={mock.chartData}
              categories={mock.categories}
              onAddExpense={mock.asyncNoop}
              onViewAllExpenses={() => setActiveTab('expenses')}
              stats={mock.stats}
              onDismissDigest={mock.asyncNoop}
              onStartNewMonth={mock.asyncNoop}
              prevMonthSummary={null}
              showMonthEnd={false}
            />
          )}
          {activeTab === 'expenses' && (
            <Expenses
              monthKey={mock.monthKey}
              onMonthChange={mock.noop}
              expenses={mock.expenses}
              categories={mock.categories}
              onAddExpense={mock.asyncNoop}
              onUpdateExpense={mock.asyncNoop}
              onDeleteExpense={mock.asyncNoop}
            />
          )}
          {activeTab === 'budget' && (
            <Budget
              monthKey={mock.monthKey}
              onMonthChange={mock.noop}
              categories={mock.categories}
              expenses={mock.expenses}
              primaryIncome={mock.income - 400}
              sources={mock.sources}
              totalIncome={mock.income}
              onSetBudgetLimit={mock.asyncNoop}
              onAddSource={mock.asyncNoop}
              onUpdateSource={mock.asyncNoop}
              onDeleteSource={mock.asyncNoop}
              onEditPrimary={mock.noop}
            />
          )}
          {activeTab === 'splurge' && (
            <Splurge
              goals={mock.goals}
              loading={false}
              onAddGoal={mock.asyncNoop}
              onUpdateGoal={mock.asyncNoop}
              onDeleteGoal={mock.asyncNoop}
              onAddContribution={mock.asyncNoop}
            />
          )}
          {activeTab === 'settings' && (
            <Settings
              user={mock.user}
              income={mock.income - 400}
              totalIncome={mock.income}
              categories={mock.categories}
              themeId={themeId}
              onSetIncome={mock.asyncNoop}
              onAddCategory={mock.asyncNoop}
              onUpdateCategory={mock.asyncNoop}
              onDeleteCategory={mock.asyncNoop}
              onReorderCategories={mock.asyncNoop}
              onThemeChange={mock.asyncNoop}
              onSignOut={mock.asyncNoop}
            />
          )}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
