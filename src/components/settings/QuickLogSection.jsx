import { useState } from 'react'
import Icon from '../icons/Icon'
import { useToast } from '../layout/Toast'

function Toggle({ on, onChange, busy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={onChange}
      className="relative w-12 h-7 rounded-full transition-colors duration-300 flex-shrink-0 disabled:opacity-60"
      style={{ background: on ? 'var(--theme-accent)' : 'var(--theme-surface)' }}
    >
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300"
        style={{ left: on ? 'calc(100% - 1.625rem)' : '0.125rem' }}
      />
    </button>
  )
}

export default function QuickLogSection({ quickLog }) {
  const { showToast } = useToast()
  const [busy, setBusy] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  if (!quickLog) return null
  const { config, loading, enable, disable } = quickLog
  const isOn = !!config?.enabled
  const endpoint = `${window.location.origin}/api/quick-log`

  const handleToggle = async () => {
    setBusy(true)
    try {
      if (isOn) {
        await disable()
        showToast?.('Quick Log disabled')
      } else {
        await enable()
        showToast?.('Quick Log enabled')
      }
    } catch {
      showToast?.("Couldn't update Quick Log — run the v4 database migration first")
    } finally {
      setBusy(false)
    }
  }

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value)
      showToast?.(`${label} copied`)
    } catch {
      showToast?.("Couldn't copy — long-press to copy manually")
    }
  }

  return (
    <div className="glass-card mb-4 overflow-hidden reveal" style={{ '--delay': '0.18s' }}>
      <div className="flex items-center justify-between px-5 py-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="icon-chip w-10 h-10 theme-accent-text"
            style={{ background: 'color-mix(in srgb, var(--theme-accent) 14%, transparent)' }}
          >
            <Icon name="zap" size={19} />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-[var(--theme-text-on-primary)]">Quick Log</p>
            <p className="text-sm text-[var(--theme-text-muted)]">
              Log expenses from an iPhone Shortcut or Back Tap
            </p>
          </div>
        </div>
        <Toggle on={isOn} onChange={handleToggle} busy={busy || loading} />
      </div>

      {isOn && config?.token && (
        <div className="px-5 pb-5 border-t theme-divider pt-4 space-y-3 animate-fade-in">
          <div>
            <p className="theme-label mb-1">Endpoint</p>
            <button
              type="button"
              onClick={() => copy('Endpoint', endpoint)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 theme-input text-left"
            >
              <span className="text-xs num truncate">{endpoint}</span>
              <span className="theme-muted flex-shrink-0 text-xs font-medium">Copy</span>
            </button>
          </div>

          <div>
            <p className="theme-label mb-1">Secret token</p>
            <button
              type="button"
              onClick={() => copy('Token', config.token)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 theme-input text-left"
            >
              <span className="text-xs num truncate">{config.token}</span>
              <span className="theme-muted flex-shrink-0 text-xs font-medium">Copy</span>
            </button>
            <p className="text-xs theme-muted mt-1.5">
              Anyone with this token can add expenses to your account. Turning Quick Log off stops it working.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSetup((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium theme-accent-text"
          >
            How to set up the Shortcut
            <span
              className="transition-transform duration-300 inline-flex"
              style={{ transform: showSetup ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <Icon name="chevron-down" size={15} />
            </span>
          </button>

          {showSetup && (
            <ol className="text-sm theme-muted space-y-2 list-decimal pl-5 animate-fade-in">
              <li>Open the <span className="theme-heading">Shortcuts</span> app → new Shortcut.</li>
              <li>Add <span className="theme-heading">Ask for Input</span> (Text) — prompt: &ldquo;What did you buy?&rdquo;.</li>
              <li>Add another <span className="theme-heading">Ask for Input</span> (Number) — prompt: &ldquo;How much?&rdquo;.</li>
              <li>
                Add <span className="theme-heading">Get Contents of URL</span> — paste the endpoint above, set
                Method to <span className="theme-heading">POST</span>, and add JSON fields:{' '}
                <span className="num text-xs">token</span> (paste your token),{' '}
                <span className="num text-xs">name</span> (first input),{' '}
                <span className="num text-xs">amount</span> (second input).
              </li>
              <li>
                In Settings → Accessibility → Touch → <span className="theme-heading">Back Tap</span>, set
                Double Tap to run your Shortcut.
              </li>
            </ol>
          )}
        </div>
      )}
    </div>
  )
}
