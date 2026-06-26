export function getSafeToSpend(remainingBalance, currentDate = new Date()) {
  const today = new Date(currentDate)
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const dayOfMonth = today.getDate()
  const daysLeft = daysInMonth - dayOfMonth + 1
  if (daysLeft <= 0) return 0
  return Math.floor(remainingBalance / daysLeft)
}
