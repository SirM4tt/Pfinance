export function checkMonthEnd({ totalSpent, totalIncome, currentStreak, longestStreak, bestMonth, prevMonthKey, monthKey }) {
  const underBudget = totalIncome > 0 && totalSpent <= totalIncome
  const newStreak = underBudget ? currentStreak + 1 : 0
  const newLongest = Math.max(longestStreak, newStreak)
  const newBestMonth = underBudget && totalIncome - totalSpent > 0 ? prevMonthKey : bestMonth

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    bestMonth: newBestMonth,
    lastCheckedMonth: monthKey,
    wasUnderBudget: underBudget,
  }
}

export function getPrevMonthKey(monthKey) {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 2, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function isFirstOfMonth(date = new Date()) {
  return date.getDate() === 1
}
