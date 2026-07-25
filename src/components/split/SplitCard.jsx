import { formatSGD } from '../../lib/utils'
import { buildShareText, totalWithTip } from '../../lib/splitMath'
import Icon from '../icons/Icon'

export default function SplitCard({
  split,
  paynowId,
  onSettlePerson,
  onSettleAll,
  onDelete,
  onShare,
  index = 0,
}) {
  const grand = totalWithTip(split.total_amount, split.tip_percent)
  const unpaid = (split.participants || []).filter((p) => !p.settled && !p.is_payer)

  const handleCopyShare = async (participant) => {
    const text = buildShareText({ split, participant, paynowId })
    try {
      await navigator.clipboard.writeText(text)
      onShare?.('Copied share message')
    } catch {
      onShare?.(text)
    }
  }

  return (
    <div className="glass-card p-4 reveal" style={{ '--delay': `${0.05 + index * 0.04}s` }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="font-semibold theme-heading font-display truncate">{split.title}</p>
          <p className="text-xs theme-muted mt-0.5">
            {new Date(split.date + 'T00:00:00').toLocaleDateString('en-SG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {' · '}
            Paid by {split.payer_name}
            {Number(split.tip_percent) > 0 ? ` · ${split.tip_percent}% tip` : ''}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold num theme-heading">{formatSGD(grand)}</p>
          {split.settled ? (
            <span className="text-[10px] uppercase tracking-wide theme-accent-text">Settled</span>
          ) : (
            <span className="text-[10px] uppercase tracking-wide theme-muted">{unpaid.length} open</span>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {(split.participants || []).map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 py-2 px-2.5 rounded-xl"
            style={{ background: 'var(--theme-surface)' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm theme-heading truncate">
                {p.name}
                {p.is_payer ? ' · paid' : ''}
              </p>
              <p className="text-xs theme-muted num">Share {formatSGD(p.amount_owed)}</p>
            </div>
            {p.is_payer || p.settled ? (
              <span className="text-xs theme-accent-text flex items-center gap-1">
                <Icon name="check" size={14} />
                {p.is_payer ? 'Covered' : 'Paid'}
              </span>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleCopyShare(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg theme-btn-ghost pressable"
                  aria-label={`Share with ${p.name}`}
                >
                  <Icon name="share" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onSettlePerson(split.id, p.id)}
                  className="px-2.5 h-8 rounded-lg text-xs font-semibold theme-btn-secondary pressable"
                >
                  Settle
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {!split.settled && unpaid.length > 0 && (
          <button
            type="button"
            onClick={() => onSettleAll(split.id)}
            className="flex-1 py-2 text-sm font-medium rounded-xl theme-btn-secondary pressable"
          >
            Settle all
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Delete "${split.title}"?`)) onDelete(split.id)
          }}
          className="w-10 h-10 flex items-center justify-center rounded-xl theme-btn-ghost pressable"
          aria-label="Delete split"
        >
          <Icon name="trash" size={16} />
        </button>
      </div>
    </div>
  )
}
