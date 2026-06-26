export default function SupabaseStatus({ error, loading, onRetry }) {
  if (loading) {
    return (
      <div className="mx-4 mt-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm text-center">
        Syncing with Supabase…
      </div>
    )
  }

  if (!error) return null

  return (
    <div className="mx-4 mt-3 px-4 py-3 rounded-xl bg-accent-red/10 border border-accent-red/30 text-sm">
      <p className="text-accent-red font-medium mb-1">Supabase connection issue</p>
      <p className="text-white/70 text-xs mb-2">{error}</p>
      <button
        onClick={onRetry}
        className="text-xs text-accent-blue font-medium"
      >
        Retry
      </button>
    </div>
  )
}
