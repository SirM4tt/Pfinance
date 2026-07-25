/** Round to 2 decimal places (SGD cents). */
export function roundCents(n) {
  return Math.round((Number(n) || 0) * 100) / 100
}

/** Bill total including tip percent. */
export function totalWithTip(baseAmount, tipPercent = 0) {
  const base = Number(baseAmount) || 0
  const tip = Number(tipPercent) || 0
  return roundCents(base * (1 + tip / 100))
}

/**
 * Equal split that always sums to `total`.
 * Last person gets the remainder so cents add up.
 */
export function equalShares(total, count) {
  const n = Math.max(1, Number(count) || 1)
  const t = roundCents(total)
  const each = Math.floor((t * 100) / n) / 100
  const shares = Array.from({ length: n }, () => each)
  const sumExceptLast = roundCents(each * (n - 1))
  shares[n - 1] = roundCents(t - sumExceptLast)
  return shares
}

/**
 * Build participant rows from names + optional custom amounts.
 * `amount_owed` is each person's share of the bill.
 * Payer is auto-marked settled; others owe the payer their share.
 */
export function buildParticipants({ names, payerName, total, customAmounts }) {
  const clean = names.map((n) => n.trim()).filter(Boolean)
  if (!clean.length) return []

  const shares =
    customAmounts && customAmounts.length === clean.length
      ? customAmounts.map(roundCents)
      : equalShares(total, clean.length)

  return clean.map((name, i) => {
    const isPayer = name === payerName
    return {
      name,
      is_payer: isPayer,
      amount_owed: shares[i],
      settled: isPayer,
    }
  })
}

/**
 * Net balances across open splits.
 * Positive = they owe you; negative = you owe them.
 */
export function netBalances(splits, youLabel = 'You') {
  const map = {}

  for (const split of splits) {
    if (split.settled) continue
    const payer = split.payer_name
    for (const p of split.participants || []) {
      if (p.settled || p.is_payer) continue
      const owed = Number(p.amount_owed) || 0
      if (owed <= 0) continue

      if (payer === youLabel) {
        map[p.name] = (map[p.name] || 0) + owed
      } else if (p.name === youLabel) {
        map[payer] = (map[payer] || 0) - owed
      }
    }
  }

  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount: roundCents(amount) }))
    .filter((b) => b.amount !== 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
}

/** WhatsApp-ready share text for one person's share. */
export function buildShareText({ split, participant, paynowId }) {
  const amount = formatShareAmount(participant.amount_owed)
  const lines = [
    `${split.title} — you owe ${amount}`,
    `Total bill: ${formatShareAmount(totalWithTip(split.total_amount, split.tip_percent))}`,
    `Paid by: ${split.payer_name}`,
  ]
  if (split.date) lines.push(`Date: ${split.date}`)
  if (paynowId) lines.push(`PayNow: ${paynowId}`)
  lines.push('')
  lines.push('Sent from Pfinance')
  return lines.join('\n')
}

function formatShareAmount(n) {
  const value = Number(n) || 0
  return `S$${value.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Your share of a split (for expense logging). */
export function yourShare(split, youLabel = 'You') {
  const you = (split.participants || []).find((p) => p.name === youLabel)
  if (!you) return 0
  return roundCents(you.amount_owed)
}

export function splitIsFullySettled(participants) {
  return (participants || []).every((p) => p.settled || p.is_payer)
}
