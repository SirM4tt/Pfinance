const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'expenses', label: 'Expenses', icon: '📋' },
  { id: 'budget', label: 'Budget', icon: '🎯' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-40">
      <div className="max-w-lg mx-auto flex">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 pt-2.5 transition-colors ${
                isActive ? 'text-navy' : 'text-gray-400'
              }`}
            >
              <span className="text-xl leading-none mb-1">{tab.icon}</span>
              <span className={`text-[10px] font-medium ${isActive ? 'text-navy' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && <span className="w-1 h-1 rounded-full bg-navy mt-0.5" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
