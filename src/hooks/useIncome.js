import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useIncome(user, monthKey) {
  const [income, setIncome] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchIncome = useCallback(async () => {
    if (!user) {
      setIncome(0)
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('income')
      .select('amount')
      .eq('user_id', user.id)
      .eq('month', monthKey)
      .maybeSingle()

    if (error) {
      console.error('Failed to fetch income:', error)
      setIncome(0)
    } else {
      setIncome(Number(data?.amount ?? 0))
    }

    setLoading(false)
  }, [user, monthKey])

  useEffect(() => {
    fetchIncome()
  }, [fetchIncome])

  const setIncomeAmount = async (amount) => {
    const numericAmount = Number(amount)

    const { data, error } = await supabase
      .from('income')
      .upsert(
        {
          user_id: user.id,
          month: monthKey,
          amount: numericAmount,
        },
        { onConflict: 'user_id,month' }
      )
      .select('amount')
      .single()

    if (error) throw error
    setIncome(Number(data.amount))
    return data
  }

  return { income, loading, setIncome: setIncomeAmount, refresh: fetchIncome }
}
