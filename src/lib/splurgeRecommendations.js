export function getMonthlyRecommendation(targetAmount, savedAmount, targetDate) {
  const today = new Date()
  const target = new Date(targetDate + 'T00:00:00')
  const monthsLeft = Math.max(
    1,
    (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth())
  )
  const remaining = targetAmount - savedAmount
  const recommended = Math.ceil(remaining / monthsLeft)

  return {
    monthsLeft,
    remaining,
    recommended,
    aggressive: Math.ceil(recommended * 1.2),
    relaxed: Math.ceil(recommended * 0.8),
  }
}

export function getTargetDateFromMonths(monthsAhead) {
  const date = new Date()
  date.setMonth(date.getMonth() + monthsAhead)
  return date.toISOString().split('T')[0]
}

export function formatTargetMonth(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-SG', {
    month: 'short',
    year: 'numeric',
  })
}

export function addMonthsToDate(dateStr, months) {
  const date = new Date(dateStr + 'T00:00:00')
  date.setMonth(date.getMonth() + months)
  return date.toISOString().split('T')[0]
}
