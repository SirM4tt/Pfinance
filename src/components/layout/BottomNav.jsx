const TABS = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'expenses', label: 'Expenses', icon: '📋' },
  { id: 'budget', label: 'Budget', icon: '🎯' },
  { id: 'splurge', label: 'Splurge', icon: '✨' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomNav({ activeTab, onTabChange }) {
  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 safe-bottom z-40">
      <div className="max-w-lg mx-auto flex px-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center py-2.5 gap-0.5"
            >
              <span className={`text-xl leading-none ${isActive ? '' : 'opacity-40'}`}>
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-[var(--theme-text-on-primary)]' : 'text-[var(--theme-text-muted)]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="w-5 h-0.5 rounded-full mt-0.5"
                  style={{ background: 'var(--theme-tab-active)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
