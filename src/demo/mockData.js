// Mock data for the UI demo harness (not part of the production app)
import { getMonthKey } from '../lib/utils'

export const monthKey = getMonthKey()
const [y, m] = monthKey.split('-')
const d = (day) => `${y}-${m}-${String(day).padStart(2, '0')}`

export const categories = [
  { id: 'c1', name: 'Housing', color: '#818cf8', icon: '🏠', budget_limit: 1200, sort_order: 0 },
  { id: 'c2', name: 'Food & Dining', color: '#4ade80', icon: '🛒', budget_limit: 600, sort_order: 1 },
  { id: 'c3', name: 'Transport', color: '#f87171', icon: '🚕', budget_limit: 200, sort_order: 2 },
  { id: 'c4', name: 'Shopping', color: '#facc15', icon: '🛍️', budget_limit: 300, sort_order: 3 },
  { id: 'c5', name: 'Entertainment', color: '#fb923c', icon: '🎬', budget_limit: 150, sort_order: 4 },
  { id: 'c6', name: 'Utilities', color: '#38bdf8', icon: '⚡', budget_limit: 120, sort_order: 5 },
]

const cat = (id) => {
  const c = categories.find((c) => c.id === id)
  return { id: c.id, name: c.name, color: c.color, icon: c.icon, budget_limit: c.budget_limit }
}

export const expenses = [
  { id: 'e1', name: 'Rent', amount: 1200, date: d(1), category_id: 'c1', categories: cat('c1'), note: '' },
  { id: 'e2', name: 'NTUC groceries', amount: 86.4, date: d(2), category_id: 'c2', categories: cat('c2'), note: 'weekly run' },
  { id: 'e3', name: 'Grab to work', amount: 14.5, date: d(3), category_id: 'c3', categories: cat('c3'), note: '' },
  { id: 'e4', name: 'Kopi + toast', amount: 5.8, date: d(3), category_id: 'c2', categories: cat('c2'), note: '' },
  { id: 'e5', name: 'Uniqlo tee', amount: 29.9, date: d(4), category_id: 'c4', categories: cat('c4'), note: '' },
  { id: 'e6', name: 'Netflix', amount: 19.98, date: d(5), category_id: 'c5', categories: cat('c5'), note: '' },
  { id: 'e7', name: 'Electricity bill', amount: 74.2, date: d(5), category_id: 'c6', categories: cat('c6'), note: '' },
  { id: 'e8', name: 'Din Tai Fung', amount: 48.6, date: d(6), category_id: 'c2', categories: cat('c2'), note: 'dinner w/ friends' },
  { id: 'e9', name: 'MRT top-up', amount: 20, date: d(6), category_id: 'c3', categories: cat('c3'), note: '' },
]

export const totalSpent = expenses.reduce((s, e) => s + e.amount, 0)
export const income = 4200

export const chartData = (() => {
  const map = {}
  for (const exp of expenses) {
    const c = exp.categories
    if (!map[exp.category_id]) map[exp.category_id] = { id: exp.category_id, name: c.name, color: c.color, icon: c.icon, total: 0 }
    map[exp.category_id].total += Number(exp.amount)
  }
  const total = expenses.reduce((s, e) => s + e.amount, 0)
  return Object.values(map)
    .sort((a, b) => b.total - a.total)
    .map((c) => ({ ...c, percentage: Math.round((c.total / total) * 100) }))
})()

export const stats = {
  current_streak: 3,
  longest_streak: 5,
  best_month: null,
  theme_id: 'navy',
  last_digest_shown: new Date().toISOString().split('T')[0],
  celebration_count: 0,
  last_checked_month: monthKey,
}

export const sources = [
  { id: 's1', name: 'Freelance', amount: 400, month: monthKey },
]

export const goals = [
  { id: 'g1', name: 'Tokyo trip', emoji: '🗼', target_amount: 2500, saved: 1400, target_date: `${y}-12-01`, created_at: d(1) },
  { id: 'g2', name: 'New keyboard', emoji: '⌨️', target_amount: 250, saved: 250, target_date: `${y}-09-01`, created_at: d(2) },
]

export const splits = [
  {
    id: 'sp1',
    title: 'Din Tai Fung',
    total_amount: 145.8,
    tip_percent: 10,
    payer_name: 'You',
    date: d(6),
    settled: false,
    participants: [
      { id: 'sp1a', name: 'You', amount_owed: 53.46, is_payer: true, settled: true },
      { id: 'sp1b', name: 'Alex', amount_owed: 53.46, is_payer: false, settled: false },
      { id: 'sp1c', name: 'Sam', amount_owed: 53.46, is_payer: false, settled: false },
    ],
  },
]

export const user = { id: 'demo-user', email: 'matthew@example.com' }

export const noop = () => {}
export const asyncNoop = async () => {}

export const quickLog = {
  loading: false,
  config: { enabled: true, token: 'a3f8c12d94be7605e1f2a8c4d6b90317f5e2c8a1d4b76093' },
  enable: asyncNoop,
  disable: asyncNoop,
}
