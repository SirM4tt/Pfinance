import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSplurge(userId, enabled = true) {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchGoals = useCallback(async () => {
    if (!userId || !enabled) {
      if (!userId) setGoals([])
      setLoading(false)
      return
    }

    setLoading(true)

    const { data: goalsData, error: goalsError } = await supabase
      .from('splurge_goals')
      .select('*')
      .eq('user_id', userId)
      .order('target_date')

    if (goalsError) {
      console.error('Failed to fetch splurge goals:', goalsError)
      setGoals([])
      setLoading(false)
      return
    }

    const { data: contributionsData, error: contribError } = await supabase
      .from('splurge_contributions')
      .select('*')
      .eq('user_id', userId)

    if (contribError) {
      console.error('Failed to fetch contributions:', contribError)
      setGoals(goalsData?.map((g) => ({ ...g, saved: 0, contributions: [] })) ?? [])
      setLoading(false)
      return
    }

    const enriched = (goalsData ?? []).map((goal) => {
      const contributions = (contributionsData ?? []).filter((c) => c.goal_id === goal.id)
      const saved = contributions.reduce((sum, c) => sum + Number(c.amount), 0)
      return { ...goal, saved, contributions }
    })

    setGoals(enriched)
    setLoading(false)
  }, [userId, enabled])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const addGoal = async ({ name, description, target_amount, target_date, emoji }) => {
    const { data, error } = await supabase
      .from('splurge_goals')
      .insert({
        user_id: userId,
        name: name.trim(),
        description: description?.trim() || null,
        target_amount: Number(target_amount),
        target_date,
        emoji: emoji || '🛍️',
      })
      .select()
      .single()

    if (error) throw error
    const enriched = { ...data, saved: 0, contributions: [] }
    setGoals((prev) => [...prev, enriched].sort((a, b) => a.target_date.localeCompare(b.target_date)))
    return enriched
  }

  const updateGoal = async (id, updates) => {
    const { data, error } = await supabase
      .from('splurge_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setGoals((prev) =>
      prev
        .map((g) => (g.id === id ? { ...g, ...data } : g))
        .sort((a, b) => a.target_date.localeCompare(b.target_date))
    )
    return data
  }

  const deleteGoal = async (id) => {
    const { error } = await supabase.from('splurge_goals').delete().eq('id', id)
    if (error) throw error
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const addContribution = async (goalId, { amount, date, note }) => {
    const { data, error } = await supabase
      .from('splurge_contributions')
      .insert({
        goal_id: goalId,
        user_id: userId,
        amount: Number(amount),
        date,
        note: note?.trim() || null,
      })
      .select()
      .single()

    if (error) throw error

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g
        const contributions = [...g.contributions, data]
        const saved = contributions.reduce((sum, c) => sum + Number(c.amount), 0)
        return { ...g, contributions, saved }
      })
    )
    return data
  }

  return {
    goals,
    loading,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    refresh: fetchGoals,
  }
}
