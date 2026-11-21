import type { ReactNode } from 'react';
import { Tag } from 'lucide-react';
import { formatPrice, onImageError, sizedImage, FALLBACK_IMAGE } from '../../lib/product';
import type { Quote } from './checkoutState';

type Props = { quote: Quote | null; loading?: boolean; error?: string; children?: ReactNode };

const Row = ({ label, value, strong }: { label: ReactNode; value: ReactNode; strong?: boolean }) => (
  <div className={`flex items-center justify-between ${strong ? 'text-base font-bold text-slate-900' : 'text-sm text-slate-600'}`}>
    <span>{label}</span>
    <span className={strong ? '' : 'font-medium text-slate-900'}>{value}</span>
  </div>
);

// Server-priced order summary used on the checkout and payment steps.
const OrderSummary = ({ quote, loading, error, children }: Props) => (
  <aside className="card p-5 sm:p-6 lg:sticky lg:top-36">
    <h2 className="text-lg font-bold text-slate-900">Order summary</h2>

    {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">{error}</p>}

    {loading && !quote ? (
      <div className="mt-5 space-y-3">
        <div className="skeleton h-14" />
        <div className="skeleton h-14" />
        <div className="skeleton h-5 w-2/3" />
      </div>
    ) : quote ? (
      <div className={loading ? 'opacity-60 transition-opacity' : ''}>
        <div className="mt-4 space-y-5">
          {quote.shops.map((shop) => (
            <div key={shop.shopId}>
              {quote.shops.length > 1 && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{shop.shopName || 'Shop'}</p>}
              <ul className="space-y-3">
                {shop.items.map((item) => (
                  <li key={item._id} className="flex items-center gap-3">
                    <span className="relative shrink-0">
                      <img src={sizedImage(item.image || FALLBACK_IMAGE, 120)} onError={onImageError} alt="" className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-slate-700 px-1 text-[10px] font-bold text-white">{item.qty}</span>
                    </span>
                    <span className="min-w-0 flex-1 line-clamp-2 text-sm text-slate-700">{item.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{formatPrice(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5">
          <Row label="Subtotal" value={formatPrice(quote.subTotal)} />
          <Row label="Shipping" value={quote.shipping > 0 ? formatPrice(quote.shipping) : 'Free'} />
          {quote.discount > 0 && (
            <Row
              label={
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <Tag size={14} /> {quote.couponCode}
                </span>
              }
              value={<span className="text-emerald-700">−{formatPrice(quote.discount)}</span>}
            />
          )}
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <Row label="Total" value={formatPrice(quote.total)} strong />
        </div>
      </div>
    ) : null}

    {children && <div className="mt-5">{children}</div>}
  </aside>
);

export default OrderSummary;
