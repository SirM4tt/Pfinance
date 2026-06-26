import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useIncomeSources(userId, monthKey, enabled = true) {
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSources = useCallback(async () => {
    if (!userId || !enabled) {
      if (!userId) setSources([])
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('income_sources')
      .select('*')
      .eq('user_id', userId)
      .eq('month', monthKey)
      .order('created_at')

    if (error) {
      console.error('Failed to fetch income sources:', error)
      setSources([])
    } else {
      setSources(data ?? [])
    }

    setLoading(false)
  }, [userId, monthKey, enabled])

  useEffect(() => {
    fetchSources()
  }, [fetchSources])

  const sourcesTotal = useMemo(
    () => sources.reduce((sum, s) => sum + Number(s.amount), 0),
    [sources]
  )

  const addSource = async ({ name, amount }) => {
    const { data, error } = await supabase
      .from('income_sources')
      .insert({
        user_id: userId,
        name: name.trim(),
        amount: Number(amount),
        month: monthKey,
      })
      .select()
      .single()

    if (error) throw error
    setSources((prev) => [...prev, data])
    return data
  }

  const updateSource = async (id, updates) => {
    const { data, error } = await supabase
      .from('income_sources')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setSources((prev) => prev.map((s) => (s.id === id ? data : s)))
    return data
  }

  const deleteSource = async (id) => {
    const { error } = await supabase.from('income_sources').delete().eq('id', id)
    if (error) throw error
    setSources((prev) => prev.filter((s) => s.id !== id))
  }

  return {
    sources,
    sourcesTotal,
    loading,
    addSource,
    updateSource,
    deleteSource,
    refresh: fetchSources,
  }
}
