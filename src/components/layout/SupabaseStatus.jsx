export default function SupabaseStatus({ error, loading, onRetry }) {
  if (loading) {
    return (
      <div className="mx-4 mt-3 px-4 py-2 rounded-xl glass-card theme-muted text-sm text-center">
        Syncing with Supabase…
      </div>
    )
  }

  if (!error) return null

  return (
    <div
      className="mx-4 mt-3 px-4 py-3 rounded-xl text-sm"
      style={{
        background: 'color-mix(in srgb, var(--theme-error) 12%, transparent)',
        border: '1px solid color-mix(in srgb, var(--theme-error) 30%, transparent)',
      }}
    >
      <p className="font-medium mb-1 text-[var(--theme-error)]">Supabase connection issue</p>
      <p className="theme-muted text-xs mb-2">{error}</p>
      <button onClick={onRetry} className="text-xs font-medium theme-accent-text">
        Retry
      </button>
    </div>
  )
}
