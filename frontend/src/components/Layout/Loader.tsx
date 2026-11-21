import { LogoMark } from '../brand/Logo'

// Full-page loading state shown while routes or session data load.
function Loader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex h-[70vh] min-h-[320px] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <LogoMark className="h-12 w-12 animate-pulse" />
      <span className="text-sm font-medium text-slate-500">{label}…</span>
    </div>
  )
}

export default Loader
