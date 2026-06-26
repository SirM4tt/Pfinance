import { formatSGD } from './utils'

export function getBudgetMessage(spent, limit, lastMonthSpent = 0) {
  if (!limit || limit <= 0) return null

  const percent = (spent / limit) * 100
  const diff = spent - limit

  if (percent >= 100) {
    const ahead = lastMonthSpent > spent ? lastMonthSpent - spent : 0
    if (ahead > 0) {
      return `${formatSGD(diff)} a little more than planned — still ${formatSGD(ahead)} ahead of last month`
    }
    return `${formatSGD(diff)} a little more than planned this month`
  }

  if (percent >= 90) return 'Almost at your limit'
  if (percent < 50) return 'Plenty of room here'
  return null
}

export function getBudgetBarColor(percent) {
  if (percent >= 90) return 'bg-amber-400'
  return 'bg-[var(--theme-accent)]'
}

export function getBudgetTextColor(percent) {
  if (percent >= 90) return 'text-amber-400'
  return 'text-[var(--theme-text-muted)]'
}
