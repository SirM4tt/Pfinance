import { useMemo, useState } from 'react'
import TopBar from '../components/layout/TopBar'
import ExpenseList from '../components/expenses/ExpenseList'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import AddExpenseFab from '../components/expenses/AddExpenseFab'

export default function Expenses({
  monthKey,
  onMonthChange,
  expenses,
  categories,
  onAddExpense,
  onDeleteExpense,
}) {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        !search ||
        exp.name.toLowerCase().includes(search.toLowerCase()) ||
        exp.note?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'all' || exp.category_id === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [expenses, search, filterCategory])

  return (
    <div className="app-shell pb-28">
      <TopBar monthKey={monthKey} onMonthChange={onMonthChange} />

      <div className="px-4 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses..."
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-blue/40"
        />
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
            filterCategory === 'all'
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-white/5 text-white/70 border-white/15'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
              filterCategory === cat.id
                ? 'bg-white/20 text-white border-white/30'
                : 'bg-white/5 text-white/70 border-white/15'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="px-4">
        <ExpenseList
          expenses={filtered}
          onDelete={onDeleteExpense}
          emptyMessage={
            search || filterCategory !== 'all'
              ? 'No matching expenses'
              : 'No expenses this month'
          }
        />
      </div>

      <AddExpenseFab onClick={() => setShowAddModal(true)} />

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSubmit={onAddExpense}
      />
    </div>
  )
}
