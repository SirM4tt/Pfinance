import Icon from '../icons/Icon'

const TABS = [
  { id: 'dashboard', label: 'Home', icon: 'home' },
  { id: 'expenses', label: 'Expenses', icon: 'receipt' },
  { id: 'budget', label: 'Budget', icon: 'target' },
  { id: 'splurge', label: 'Splurge', icon: 'sparkles' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
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
              className="flex-1 flex flex-col items-center pt-2 pb-2.5 gap-1 pressable relative"
            >
              <span
                className="relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300"
                style={{
                  color: isActive ? 'var(--theme-tab-active)' : 'var(--theme-nav-inactive)',
                  background: isActive
                    ? 'color-mix(in srgb, var(--theme-tab-active) 16%, transparent)'
                    : 'transparent',
                }}
              >
                <Icon name={tab.icon} size={20} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span
                className="text-[10px] font-medium transition-colors duration-300"
                style={{
                  color: isActive ? 'var(--theme-text-on-primary)' : 'var(--theme-nav-inactive)',
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
