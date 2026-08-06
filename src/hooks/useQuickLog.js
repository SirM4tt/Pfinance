import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function generateToken() {
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Per-user secret token that lets an iOS Shortcut log expenses via /api/quick-log. */
export function useQuickLog(userId, enabled = true) {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !enabled) return
    let cancelled = false
    supabase
      .from('quick_log_tokens')
      .select('token, enabled')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) {
          setConfig(data)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [userId, enabled])

  const enable = useCallback(async () => {
    const token = config?.token || generateToken()
    const { data, error } = await supabase
      .from('quick_log_tokens')
      .upsert({ user_id: userId, token, enabled: true })
      .select('token, enabled')
      .single()
    if (error) throw error
    setConfig(data)
  }, [userId, config])

  const disable = useCallback(async () => {
    const { data, error } = await supabase
      .from('quick_log_tokens')
      .update({ enabled: false })
      .eq('user_id', userId)
      .select('token, enabled')
      .single()
    if (error) throw error
    setConfig(data)
  }, [userId])

  return { config, loading, enable, disable }
}
