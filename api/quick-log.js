// Vercel serverless function: log an expense from an iOS Shortcut (Back Tap).
// POST { token, name, amount, category?, date?, note? }
//
// Auth is a per-user secret token generated in Settings → Quick Log.
// Requires env vars on Vercel: VITE_SUPABASE_URL (already set) and
// SUPABASE_SERVICE_ROLE_KEY (add from Supabase → Settings → API).
import { createClient } from '@supabase/supabase-js'

const MAX_AMOUNT = 1_000_000

function todaySG() {
  // en-CA gives YYYY-MM-DD
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server not configured' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' })

  const token = typeof body.token === 'string' ? body.token.trim() : ''
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : ''
  const amount = Number(body.amount)

  if (!token) return res.status(401).json({ error: 'Missing token' })
  if (!name) return res.status(400).json({ error: 'Missing expense name' })
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  })

  const { data: tokenRow } = await supabase
    .from('quick_log_tokens')
    .select('user_id, enabled')
    .eq('token', token)
    .maybeSingle()

  if (!tokenRow || !tokenRow.enabled) {
    return res.status(401).json({ error: 'Invalid or disabled token' })
  }

  // Optional category by (case-insensitive) name
  let categoryId = null
  const categoryName = typeof body.category === 'string' ? body.category.trim() : ''
  if (categoryName) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', tokenRow.user_id)
      .ilike('name', categoryName)
      .maybeSingle()
    categoryId = cat?.id ?? null
  }

  const date = /^\d{4}-\d{2}-\d{2}$/.test(body.date || '') ? body.date : todaySG()
  const note = typeof body.note === 'string' && body.note.trim() ? body.note.trim().slice(0, 300) : null

  const { data: expense, error } = await supabase
    .from('expenses')
    .insert({
      user_id: tokenRow.user_id,
      name,
      amount,
      category_id: categoryId,
      date,
      note,
    })
    .select('name, amount, date')
    .single()

  if (error) {
    return res.status(500).json({ error: 'Failed to log expense' })
  }

  return res.status(200).json({
    ok: true,
    message: `Logged ${expense.name} — S$${Number(expense.amount).toFixed(2)}`,
  })
}

function safeParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
