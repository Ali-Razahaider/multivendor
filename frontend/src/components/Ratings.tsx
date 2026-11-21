import { Star } from 'lucide-react'

type Props = { rating?: number; size?: number; showValue?: boolean; className?: string }

// Five stars with partial fill, plus an accessible label.
const Ratings = ({ rating = 0, size = 18, showValue = false, className = '' }: Props) => {
  const value = Math.max(0, Math.min(5, Number(rating) || 0))
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <span className="inline-flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i))
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-slate-300" strokeWidth={1.5} />
              {fill > 0 && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                  <Star size={size} className="fill-amber-400 text-amber-400" strokeWidth={1.5} />
                </span>
              )}
            </span>
          )
        })}
      </span>
      {showValue && <span className="text-sm font-semibold text-slate-700">{value.toFixed(1)}</span>}
    </span>
  )
}

export default Ratings
