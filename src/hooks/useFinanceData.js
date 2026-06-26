import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_CATEGORIES, getMonthDateRange } from '../lib/utils'

const EMPTY = {
  categories: [],
  income: 0,
  hasIncomeRecord: false,
  sources: [],
  expenses: [],
  loading: true,
  error: null,
}

function pickData(res, fallback = null) {
  if (res.error) return { data: fallback, error: res.error }
  return { data: res.data ?? fallback, error: null }
}

export function useFinanceData(userId, monthKey, enabled = true) {
  const [data, setData] = useState(EMPTY)

  const load = useCallback(async () => {
    if (!userId || !enabled) {
      setData({ ...EMPTY, loading: false })
      return
    }

    setData((prev) => ({ ...prev, loading: true, error: null }))
    const { start, end } = getMonthDateRange(monthKey)
    const errors = []

    try {
      const [categoriesRes, incomeRes, sourcesRes, expensesRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('income').select('amount').eq('user_id', userId).eq('month', monthKey).maybeSingle(),
        // income_sources is optional — don't block the app if this table/query fails
        supabase.from('income_sources').select('*').eq('user_id', userId).eq('month', monthKey).order('created_at'),
        supabase
          .from('expenses')
          .select('*, categories(id, name, color, icon, budget_limit)')
          .eq('user_id', userId)
          .gte('date', start)
          .lte('date', end)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false }),
      ])

      const categoriesResult = pickData(categoriesRes, [])
      const incomeResult = pickData(incomeRes)
      const sourcesResult = pickData(sourcesRes, [])
      const expensesResult = pickData(expensesRes, [])

      if (categoriesResult.error) errors.push(`Categories: ${categoriesResult.error.message}`)
      if (incomeResult.error) errors.push(`Income: ${incomeResult.error.message}`)
      if (sourcesResult.error) errors.push(`Income sources: ${sourcesResult.error.message}`)
      if (expensesResult.error) errors.push(`Expenses: ${expensesResult.error.message}`)

      let categories = categoriesResult.data ?? []

      if (!categories.length && !categoriesResult.error) {
        const rows = DEFAULT_CATEGORIES.map((cat) => ({ user_id: userId, ...cat }))
        const { data: seeded, error: seedError } = await supabase.from('categories').insert(rows).select()
        if (seedError) {
          errors.push(`Category setup: ${seedError.message}`)
        } else {
          categories = seeded ?? []
        }
      }

      const incomeRow = incomeResult.data
      const sources = sourcesResult.error ? [] : (sourcesResult.data ?? [])
      const expenses = expensesResult.data ?? []

      setData({
        categories,
        income: Number(incomeRow?.amount ?? 0),
        hasIncomeRecord: !!incomeRow,
        sources,
        expenses,
        loading: false,
        error: errors.length ? errors.join(' · ') : null,
      })
    } catch (err) {
      console.error('Failed to load finance data:', err)
      setData({
        ...EMPTY,
        loading: false,
        error: err.message || 'Could not connect to Supabase',
      })
    }
  }, [userId, monthKey, enabled])

  useEffect(() => {
    load()
  }, [load])

  const sourcesTotal = useMemo(
    () => data.sources.reduce((sum, s) => sum + Number(s.amount), 0),
    [data.sources]
  )

  const totalIncome = data.income + sourcesTotal

  const totalSpent = useMemo(
    () => data.expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [data.expenses]
  )

  const chartData = useMemo(() => {
    if (!totalSpent) return []
    const map = {}
    for (const exp of data.expenses) {
      const catId = exp.category_id || 'uncategorized'
      if (!map[catId]) {
        map[catId] = {
          id: catId,
          name: exp.categories?.name || 'Uncategorized',
          color: exp.categories?.color || '#94a3b8',
          icon: exp.categories?.icon || '💳',
          total: 0,
        }
      }
      map[catId].total += Number(exp.amount)
    }
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .map((cat) => ({ ...cat, percentage: Math.round((cat.total / totalSpent) * 100) }))
  }, [data.expenses, totalSpent])

  const setIncome = async (amount) => {
    const { data: row, error } = await supabase
      .from('income')
      .upsert({ user_id: userId, month: monthKey, amount: Number(amount) }, { onConflict: 'user_id,month' })
      .select('amount')
      .single()
    if (error) throw error
    setData((prev) => ({
      ...prev,
      income: Number(row.amount),
      hasIncomeRecord: true,
      error: null,
    }))
  }

  const addExpense = async ({ name, amount, category_id, date, note }) => {
    const { data: row, error } = await supabase
      .from('expenses')
      .insert({
        user_id: userId,
        name,
        amount: Number(amount),
        category_id: category_id || null,
        date,
        note: note || null,
      })
      .select('*, categories(id, name, color, icon, budget_limit)')
      .single()
    if (error) throw error
    setData((prev) => ({ ...prev, expenses: [row, ...prev.expenses] }))
    return row
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) throw error
    setData((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }))
  }

  const addSource = async ({ name, amount }) => {
    const { data: row, error } = await supabase
      .from('income_sources')
      .insert({ user_id: userId, name: name.trim(), amount: Number(amount), month: monthKey })
      .select()
      .single()
    if (error) throw error
    setData((prev) => ({ ...prev, sources: [...prev.sources, row] }))
    return row
  }

  const updateSource = async (id, updates) => {
    const { data: row, error } = await supabase.from('income_sources').update(updates).eq('id', id).select().single()
    if (error) throw error
    setData((prev) => ({ ...prev, sources: prev.sources.map((s) => (s.id === id ? row : s)) }))
    return row
  }

  const deleteSource = async (id) => {
    const { error } = await supabase.from('income_sources').delete().eq('id', id)
    if (error) throw error
    setData((prev) => ({ ...prev, sources: prev.sources.filter((s) => s.id !== id) }))
  }

  const setBudgetLimit = async (id, budget_limit) => {
    const { data: row, error } = await supabase
      .from('categories')
      .update({ budget_limit })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? row : c)),
    }))
    return row
  }

  const addCategory = async ({ name, color, icon }) => {
    const { data: row, error } = await supabase
      .from('categories')
      .insert({ user_id: userId, name, color: color || '#818cf8', icon: icon || '💳' })
      .select()
      .single()
    if (error) throw error
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, row].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    return row
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    setData((prev) => ({ ...prev, categories: prev.categories.filter((c) => c.id !== id) }))
  }

  return {
    ...data,
    sourcesTotal,
    totalIncome,
    totalSpent,
    chartData,
    setIncome,
    addExpense,
    deleteExpense,
    addSource,
    updateSource,
    deleteSource,
    setBudgetLimit,
    addCategory,
    deleteCategory,
    refresh: load,
  }
}
