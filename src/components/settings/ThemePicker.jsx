import { THEMES } from '../../lib/themes'

export default function ThemePicker({ currentTheme, onSelect }) {
  return (
    <div className="glass-card mb-4 p-5">
      <p className="font-medium text-[var(--theme-text-on-primary)] mb-4">🎨 Appearance</p>
      <p className="text-sm text-[var(--theme-text-muted)] mb-3">Theme</p>
      <div className="space-y-2">
        {Object.values(THEMES).map((theme) => {
          const selected = currentTheme === theme.id
          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
                selected ? 'border-[var(--theme-accent)] bg-[var(--theme-card-bg)]' : 'border-white/10'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  selected ? 'border-[var(--theme-accent)] bg-[var(--theme-accent)]' : 'border-white/30'
                }`}
              />
              <span className="flex-1 text-left text-sm text-[var(--theme-text-on-primary)]">
                {theme.name}
              </span>
              <div className="flex gap-1">
                {theme.preview.map((color) => (
                  <span
                    key={color}
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
