import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useIncome(userId, monthKey) {
  const [income, setIncome] = useState(0)
  const [hasRecord, setHasRecord] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchIncome = useCallback(async () => {
    if (!userId) {
      setIncome(0)
      setHasRecord(false)
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('income')
      .select('amount')
      .eq('user_id', userId)
      .eq('month', monthKey)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch income:', error)
      setIncome(0)
      setHasRecord(false)
    } else {
      setHasRecord(!!data)
      setIncome(Number(data?.amount ?? 0))
    }

    setLoading(false)
  }, [userId, monthKey])

  useEffect(() => {
    fetchIncome()
  }, [fetchIncome])

  const setIncomeAmount = async (amount) => {
    const numericAmount = Number(amount)

    const { data, error } = await supabase
      .from('income')
      .upsert(
        { user_id: userId, month: monthKey, amount: numericAmount },
        { onConflict: 'user_id,month' }
      )
      .select('amount')
      .single()

    if (error) throw error
    setIncome(Number(data.amount))
    setHasRecord(true)
    return data
  }

  return {
    income,
    hasRecord,
    loading,
    setIncome: setIncomeAmount,
    refresh: fetchIncome,
  }
}
