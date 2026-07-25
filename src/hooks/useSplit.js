import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { buildParticipants, splitIsFullySettled, totalWithTip } from '../lib/splitMath'

export function useSplit(userId, enabled = true) {
  const [splits, setSplits] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSplits = useCallback(async () => {
    if (!userId || !enabled) {
      if (!userId) setSplits([])
      setLoading(false)
      return
    }

    setLoading(true)

    const { data: splitsData, error: splitsError } = await supabase
      .from('splits')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (splitsError) {
      console.error('Failed to fetch splits:', splitsError)
      setSplits([])
      setLoading(false)
      return
    }

    const { data: partsData, error: partsError } = await supabase
      .from('split_participants')
      .select('*')
      .eq('user_id', userId)

    if (partsError) {
      console.error('Failed to fetch split participants:', partsError)
      setSplits((splitsData ?? []).map((s) => ({ ...s, participants: [] })))
      setLoading(false)
      return
    }

    const enriched = (splitsData ?? []).map((split) => {
      const participants = (partsData ?? []).filter((p) => p.split_id === split.id)
      return { ...split, participants }
    })

    setSplits(enriched)
    setLoading(false)
  }, [userId, enabled])

  useEffect(() => {
    fetchSplits()
  }, [fetchSplits])

  const addSplit = async ({
    title,
    total_amount,
    tip_percent = 0,
    payer_name = 'You',
    date,
    note,
    names,
    customAmounts,
    expense_id = null,
  }) => {
    const tip = Number(tip_percent) || 0
    const base = Number(total_amount)
    const grand = totalWithTip(base, tip)
    const participants = buildParticipants({
      names,
      payerName: payer_name,
      total: grand,
      customAmounts,
    })

    const { data: split, error } = await supabase
      .from('splits')
      .insert({
        user_id: userId,
        title: title.trim(),
        total_amount: base,
        tip_percent: tip,
        payer_name,
        date: date || new Date().toISOString().split('T')[0],
        note: note?.trim() || null,
        expense_id,
        settled: splitIsFullySettled(participants),
      })
      .select()
      .single()

    if (error) throw error

    const rows = participants.map((p) => ({
      split_id: split.id,
      user_id: userId,
      name: p.name,
      amount_owed: p.amount_owed,
      is_payer: p.is_payer,
      settled: p.settled,
    }))

    const { data: insertedParts, error: partsError } = await supabase
      .from('split_participants')
      .insert(rows)
      .select()

    if (partsError) throw partsError

    const enriched = { ...split, participants: insertedParts ?? [] }
    setSplits((prev) => [enriched, ...prev])
    return enriched
  }

  const settleParticipant = async (splitId, participantId) => {
    const { data, error } = await supabase
      .from('split_participants')
      .update({ settled: true })
      .eq('id', participantId)
      .select()
      .single()

    if (error) throw error

    let allSettled = false
    setSplits((prev) =>
      prev.map((s) => {
        if (s.id !== splitId) return s
        const participants = s.participants.map((p) =>
          p.id === participantId ? { ...p, ...data } : p
        )
        allSettled = splitIsFullySettled(participants)
        return { ...s, participants, settled: allSettled }
      })
    )

    if (allSettled) {
      await supabase.from('splits').update({ settled: true }).eq('id', splitId)
    }

    return data
  }

  const settleSplit = async (splitId) => {
    const { error: partsError } = await supabase
      .from('split_participants')
      .update({ settled: true })
      .eq('split_id', splitId)

    if (partsError) throw partsError

    const { data, error } = await supabase
      .from('splits')
      .update({ settled: true })
      .eq('id', splitId)
      .select()
      .single()

    if (error) throw error

    setSplits((prev) =>
      prev.map((s) =>
        s.id === splitId
          ? {
              ...s,
              ...data,
              participants: s.participants.map((p) => ({ ...p, settled: true })),
            }
          : s
      )
    )
    return data
  }

  const linkExpense = async (splitId, expenseId) => {
    const { data, error } = await supabase
      .from('splits')
      .update({ expense_id: expenseId })
      .eq('id', splitId)
      .select()
      .single()

    if (error) throw error
    setSplits((prev) => prev.map((s) => (s.id === splitId ? { ...s, ...data } : s)))
    return data
  }

  const deleteSplit = async (id) => {
    const { error } = await supabase.from('splits').delete().eq('id', id)
    if (error) throw error
    setSplits((prev) => prev.filter((s) => s.id !== id))
  }

  return {
    splits,
    loading,
    addSplit,
    settleParticipant,
    settleSplit,
    linkExpense,
    deleteSplit,
    refresh: fetchSplits,
  }
}
