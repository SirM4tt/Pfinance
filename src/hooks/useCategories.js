import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_CATEGORIES } from '../lib/utils'

export function useCategories(userId) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    if (!userId) {
      setCategories([])
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Failed to fetch categories:', error)
      setLoading(false)
      return
    }

    if (!data?.length) {
      const rows = DEFAULT_CATEGORIES.map((cat) => ({
        user_id: userId,
        ...cat,
      }))

      const { data: seeded, error: seedError } = await supabase
        .from('categories')
        .insert(rows)
        .select()

      if (seedError) {
        console.error('Failed to seed categories:', seedError)
        setCategories([])
      } else {
        setCategories(seeded ?? [])
      }
    } else {
      setCategories(data)
    }

    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = async ({ name, color, icon, budget_limit }) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: userId,
        name,
        color: color || '#818cf8',
        icon: icon || '💳',
        budget_limit: budget_limit ?? null,
      })
      .select()
      .single()

    if (error) throw error
    setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }

  const updateCategory = async (id, updates) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? data : cat)).sort((a, b) => a.name.localeCompare(b.name))
    )
    return data
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const setBudgetLimit = async (id, budget_limit) => updateCategory(id, { budget_limit })

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    setBudgetLimit,
    refresh: fetchCategories,
  }
}
