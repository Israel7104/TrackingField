type Props = {
  status: 'loading' | 'success' | 'error'
  message: string
  onRetry?: () => void
}

const toneClasses = {
  loading: 'border-amber-200 bg-amber-50 text-amber-950',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  error: 'border-rose-200 bg-rose-50 text-rose-950',
}

export default function StatusBanner({ status, message, onRetry }: Props) {
  return (
    <div
      className={`mx-8 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border px-4 py-3 text-sm font-semibold shadow-sm ${toneClasses[status]}`}
      role={status === 'error' ? 'alert' : 'status'}
    >
      <span>{message}</span>
      {status === 'error' && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-current px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  )
}