export function generateDigest(expenses, income, todayDate = new Date()) {
  const today = new Date(todayDate)
  const weekAgo = new Date(today)
  weekAgo.setDate(today.getDate() - 7)

  const weekExpenses = expenses.filter((e) => {
    const d = new Date(e.date + 'T00:00:00')
    return d >= weekAgo && d <= today
  })

  const totalSpent = weekExpenses.reduce((s, e) => s + Number(e.amount), 0)

  const byCat = {}
  for (const e of weekExpenses) {
    const name = e.categories?.name || 'Other'
    byCat[name] = (byCat[name] || 0) + Number(e.amount)
  }
  const biggestCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

  const monthSpent = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const remainingBalance = income - monthSpent
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysLeft = daysInMonth - today.getDate() + 1
  const onTrack = income > 0 && monthSpent <= income * (today.getDate() / daysInMonth)

  return { totalSpent, biggestCategory, onTrack, daysLeft, remainingBalance }
}

export function isSunday(date = new Date()) {
  return date.getDay() === 0
}

export function digestLines(digest) {
  const lines = [`You spent S$${digest.totalSpent.toFixed(2)} this week.`]
  lines.push(`${digest.biggestCategory} was your biggest category.`)
  if (digest.onTrack) {
    lines.push(`You're on track for the month — S$${Math.max(0, digest.remainingBalance).toFixed(2)} left.`)
  } else {
    lines.push(`It's been a big week. ${digest.daysLeft} days to go, you've got this.`)
  }
  return lines
}
