import Icon from '../icons/Icon'

export default function AddExpenseFab({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fab-button fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 flex items-center gap-2 pl-4 pr-5 h-[52px] rounded-full font-semibold text-[15px] z-50"
      aria-label="Add expense"
    >
      <span className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: 'rgba(0,0,0,0.14)' }}>
        <Icon name="plus" size={16} strokeWidth={2.6} />
      </span>
      Add Expense
    </button>
  )
}
