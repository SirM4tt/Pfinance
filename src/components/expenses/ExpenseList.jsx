import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ expenses, onEdit, onDelete, emptyMessage }) {
  if (!expenses.length) {
    return (
      <div className="text-center py-12 theme-muted text-sm">
        {emptyMessage || 'No expenses found'}
      </div>
    )
  }

  return (
    <div className="glass-card px-4 py-2 divide-y divide-white/5">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
