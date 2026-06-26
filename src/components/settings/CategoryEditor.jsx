import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { COLOR_SWATCHES, CATEGORY_EMOJIS } from '../../lib/categoryColors'

function SortableCategoryRow({ cat, onUpdate, onDelete }) {
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(cat.name)
  const [picker, setPicker] = useState(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cat.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const saveName = async () => {
    setEditingName(false)
    const trimmed = name.trim()
    if (trimmed && trimmed !== cat.name) {
      await onUpdate(cat.id, { name: trimmed })
    } else {
      setName(cat.name)
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <button
          type="button"
          className="touch-none text-white/30 text-lg px-1"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>

        <button
          type="button"
          onClick={() => setPicker(picker === 'emoji' ? null : 'emoji')}
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${cat.color}30` }}
        >
          {cat.icon}
        </button>

        {editingName ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            className="flex-1 px-2 py-1 text-sm rounded-lg bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)]"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingName(true)}
            className="flex-1 text-left text-sm font-medium text-[var(--theme-text-on-primary)]"
          >
            {cat.name}
          </button>
        )}

        <button
          type="button"
          onClick={() => setPicker(picker === 'color' ? null : 'color')}
          className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0"
          style={{ backgroundColor: cat.color }}
          aria-label="Change colour"
        />

        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${cat.name}"?`)) onDelete(cat.id)
          }}
          className="text-xs text-white/40 px-2"
        >
          Delete
        </button>
      </div>

      {picker === 'color' && (
        <div className="px-4 py-3 grid grid-cols-6 gap-2 border-b border-white/10 bg-black/20">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              onClick={async () => {
                await onUpdate(cat.id, { color: swatch.value })
                setPicker(null)
              }}
              className={`w-8 h-8 rounded-full border-2 ${
                cat.color === swatch.value ? 'border-[var(--theme-accent)]' : 'border-transparent'
              }`}
              style={{ backgroundColor: swatch.value }}
              title={swatch.label}
            />
          ))}
        </div>
      )}

      {picker === 'emoji' && (
        <div className="px-4 py-3 grid grid-cols-8 gap-1 border-b border-white/10 bg-black/20">
          {CATEGORY_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={async () => {
                await onUpdate(cat.id, { icon: emoji })
                setPicker(null)
              }}
              className={`text-xl p-1 rounded-lg ${
                cat.icon === emoji ? 'bg-[var(--theme-accent)]/20' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CategoryEditor({ categories, onUpdate, onDelete, onReorder, onAdd }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const sorted = [...categories].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sorted.findIndex((c) => c.id === active.id)
    const newIndex = sorted.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(sorted, oldIndex, newIndex)
    onReorder(reordered.map((c) => c.id))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    await onAdd({ name: newName.trim(), icon: '💳', color: '#818cf8' })
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div className="glass-card mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <p className="font-medium text-[var(--theme-text-on-primary)]">📂 Categories</p>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="text-sm font-medium text-[var(--theme-accent)]"
        >
          {showAdd ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="px-5 py-4 border-b border-white/10 flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-[var(--theme-text-on-primary)] placeholder:text-white/30"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--theme-primary)]"
            style={{ background: 'var(--theme-accent)' }}
          >
            Add
          </button>
        </form>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {sorted.map((cat) => (
            <SortableCategoryRow key={cat.id} cat={cat} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </SortableContext>
      </DndContext>

      {!sorted.length && (
        <p className="px-5 py-6 text-sm text-center text-[var(--theme-text-muted)]">
          Add categories to organise your spending
        </p>
      )}
    </div>
  )
}
