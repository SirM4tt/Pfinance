import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_STATS = {
  current_streak: 0,
  longest_streak: 0,
  best_month: null,
  last_checked_month: null,
  last_digest_shown: null,
  celebration_count: 0,
  theme_id: 'navy',
}

export function useUserStats(userId, enabled = true) {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId || !enabled) {
      setStats(DEFAULT_STATS)
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Failed to load user stats:', error)
      setStats(DEFAULT_STATS)
      setLoading(false)
      return
    }

    if (!data) {
      const { data: created } = await supabase
        .from('user_stats')
        .insert({ user_id: userId })
        .select()
        .single()
      setStats(created ?? DEFAULT_STATS)
    } else {
      setStats(data)
    }
    setLoading(false)
  }, [userId, enabled])

  useEffect(() => {
    load()
  }, [load])

  const updateStats = async (updates) => {
    const { data, error } = await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) {
      console.error('Failed to update user stats:', error)
      return stats
    }
    setStats(data)
    return data
  }

  const setTheme = async (themeId) => updateStats({ theme_id: themeId })

  const dismissDigest = async () => {
    const today = new Date().toISOString().split('T')[0]
    return updateStats({ last_digest_shown: today })
  }

  const incrementCelebration = async () => {
    if (stats.celebration_count >= 3) return stats
    return updateStats({ celebration_count: (stats.celebration_count || 0) + 1 })
  }

  return {
    stats,
    loading,
    updateStats,
    setTheme,
    dismissDigest,
    incrementCelebration,
    refresh: load,
  }
}
