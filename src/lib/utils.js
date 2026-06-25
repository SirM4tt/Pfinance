export const DEFAULT_CATEGORIES = [
  { name: 'Housing', color: '#1a1a2e', icon: '🏠' },
  { name: 'Food & Dining', color: '#4ade80', icon: '🛒' },
  { name: 'Transport', color: '#f87171', icon: '🚕' },
  { name: 'Shopping', color: '#facc15', icon: '🛍️' },
  { name: 'Healthcare', color: '#818cf8', icon: '💊' },
  { name: 'Entertainment', color: '#fb923c', icon: '🎬' },
  { name: 'Utilities', color: '#38bdf8', icon: '⚡' },
  { name: 'Other', color: '#94a3b8', icon: '💳' },
]

export function formatSGD(amount) {
  const value = Number(amount) || 0
  return `S$${value.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getMonthKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-SG', { month: 'long', year: 'numeric' })
}

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getMonthDateRange(monthKey) {
  const [year, month] = monthKey.split('-')
  const start = `${year}-${month}-01`
  const lastDay = new Date(Number(year), Number(month), 0).getDate()
  const end = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}
