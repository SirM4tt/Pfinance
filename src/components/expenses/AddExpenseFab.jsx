export default function AddExpenseFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fab-button fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 h-[52px] rounded-full font-semibold text-[15px] z-50"
      aria-label="Add expense"
    >
      <span className="text-lg">✦</span>
      Add Expense
    </button>
  )
}
