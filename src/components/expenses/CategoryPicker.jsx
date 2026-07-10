import { CategoryChip } from '../icons/Icon'

export default function CategoryPicker({ categories, value, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.map((cat) => {
        const selected = value === cat.id
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-2xl border pressable transition-colors"
            style={{
              borderColor: selected ? `color-mix(in srgb, ${cat.color} 60%, transparent)` : 'transparent',
              background: selected
                ? `color-mix(in srgb, ${cat.color} 14%, transparent)`
                : 'var(--theme-surface)',
            }}
          >
            <CategoryChip icon={cat.icon} color={cat.color} size={34} iconSize={17} />
            <span
              className="text-[11px] font-medium leading-tight text-center truncate w-full"
              style={{ color: selected ? 'var(--theme-text-on-primary)' : 'var(--theme-text-muted)' }}
            >
              {cat.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
