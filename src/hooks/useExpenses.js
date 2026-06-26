import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getMonthDateRange } from '../lib/utils'

export function useExpenses(userId, monthKey, enabled = true) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = useCallback(async () => {
    if (!userId || !enabled) {
      if (!userId) setExpenses([])
      setLoading(false)
      return
    }

    setLoading(true)
    const { start, end } = getMonthDateRange(monthKey)

    const { data, error } = await supabase
      .from('expenses')
      .select('*, categories(id, name, color, icon, budget_limit)')
      .eq('user_id', userId)
      .gte('date', start)
      .lte('date', end)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch expenses:', error)
      setExpenses([])
    } else {
      setExpenses(data ?? [])
    }

    setLoading(false)
  }, [userId, monthKey, enabled])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const addExpense = async ({ name, amount, category_id, date, note }) => {
    const { data, error } = await supabase
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
    setExpenses((prev) => [data, ...prev])
    return data
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) throw error
    setExpenses((prev) => prev.filter((exp) => exp.id !== id))
  }

  const totalSpent = useMemo(
    () => expenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    [expenses]
  )

  const byCategory = useMemo(() => {
    const map = {}
    for (const exp of expenses) {
      const catId = exp.category_id || 'uncategorized'
      const catName = exp.categories?.name || 'Uncategorized'
      const catColor = exp.categories?.color || '#94a3b8'
      const catIcon = exp.categories?.icon || '💳'

      if (!map[catId]) {
        map[catId] = { id: catId, name: catName, color: catColor, icon: catIcon, total: 0, count: 0 }
      }
      map[catId].total += Number(exp.amount)
      map[catId].count += 1
    }
    return Object.values(map).sort((a, b) => b.total - a.total)
  }, [expenses])

  const chartData = useMemo(() => {
    if (!totalSpent) return []
    return byCategory.map((cat) => ({
      ...cat,
      percentage: Math.round((cat.total / totalSpent) * 100),
    }))
  }, [byCategory, totalSpent])

  return {
    expenses,
    loading,
    addExpense,
    deleteExpense,
    totalSpent,
    byCategory,
    chartData,
    refresh: fetchExpenses,
  }
}
