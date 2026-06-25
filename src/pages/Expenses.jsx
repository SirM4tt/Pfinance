import { useMemo, useState } from 'react'
import TopBar from '../components/layout/TopBar'
import ExpenseList from '../components/expenses/ExpenseList'
import AddExpenseModal from '../components/expenses/AddExpenseModal'

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
    <div className="pb-20">
      <TopBar monthKey={monthKey} onMonthChange={onMonthChange} />

      <div className="px-4 mb-4">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search expenses..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
        />
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filterCategory === 'all'
              ? 'bg-navy text-white'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filterCategory === cat.id
                ? 'bg-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200'
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

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-navy text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-navy/90 transition-colors z-30"
        aria-label="Add expense"
      >
        +
      </button>

      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
        onSubmit={onAddExpense}
      />
    </div>
  )
}
