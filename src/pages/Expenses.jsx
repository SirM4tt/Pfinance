import { useMemo, useState } from 'react'
import TopBar from '../components/layout/TopBar'
import ExpenseList from '../components/expenses/ExpenseList'
import AddExpenseModal from '../components/expenses/AddExpenseModal'
import EditExpenseModal from '../components/expenses/EditExpenseModal'
import AddExpenseFab from '../components/expenses/AddExpenseFab'
import { useToast } from '../components/layout/Toast'
import Icon, { CategoryChip } from '../components/icons/Icon'

export default function Expenses({
  monthKey,
  onMonthChange,
  expenses,
  categories,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

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

  const handleUpdateExpense = async (id, data) => {
    await onUpdateExpense(id, data)
    showToast?.('Expense updated')
  }

  return (
    <div className="app-shell pb-28">
      <TopBar monthKey={monthKey} onMonthChange={onMonthChange} />

      <div className="px-4 mb-4 reveal">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-muted pointer-events-none">
            <Icon name="search" size={17} />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="w-full pl-11 pr-4 py-3 theme-input"
          />
        </div>
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide reveal" style={{ '--delay': '0.06s' }}>
        <button
          onClick={() => setFilterCategory('all')}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border ${
            filterCategory === 'all' ? 'theme-pill-active' : 'theme-pill border-transparent'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border ${
              filterCategory === cat.id ? 'theme-pill-active' : 'theme-pill border-transparent'
            }`}
          >
            <CategoryChip icon={cat.icon} color={cat.color} size={18} iconSize={12} className="!bg-transparent" />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="px-4">
        <ExpenseList
          expenses={filtered}
          onEdit={setEditingExpense}
          onDelete={onDeleteExpense}
          emptyMessage={
            search || filterCategory !== 'all'
              ? 'No matching expenses'
              : 'Add your first expense with the button below'
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

      <EditExpenseModal
        isOpen={!!editingExpense}
        expense={editingExpense}
        categories={categories}
        onClose={() => setEditingExpense(null)}
        onSubmit={handleUpdateExpense}
      />
    </div>
  )
}
