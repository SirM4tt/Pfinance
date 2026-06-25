import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ expenses, onDelete, emptyMessage }) {
  if (!expenses.length) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        {emptyMessage || 'No expenses found'}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl px-4 shadow-sm">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  )
}
