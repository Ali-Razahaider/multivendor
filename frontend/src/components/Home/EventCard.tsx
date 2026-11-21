import { Link } from 'react-router-dom';
import { ArrowRight, Timer } from 'lucide-react';
import Countdown from './Countdown';
import type { EventData } from '../../utils/events';
import { FALLBACK_IMAGE, formatPrice, onImageError, sizedImage } from '../../lib/product';

interface EventCardProps {
  active?: boolean;
  data: EventData;
}

function EventCard({ data }: EventCardProps) {
  const firstImage = data.images?.[0];
  const imageUrl = (typeof firstImage === 'string' ? firstImage : firstImage?.url) || FALLBACK_IMAGE;
  const onSale = !!data.discountedPrice && data.discountedPrice < data.price;
  const percentOff = onSale ? Math.round(((data.price - data.discountedPrice!) / data.price) * 100) : 0;
  const shopLink = data.category ? `/products?category=${encodeURIComponent(data.category)}` : '/products';

  return (
    <article className="grid overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-(--shadow-card) lg:grid-cols-2">
      <div className="relative aspect-[4/3] bg-slate-100 lg:aspect-auto">
        <img src={sizedImage(imageUrl, 1000)} onError={onImageError} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {onSale && <span className="badge absolute left-4 top-4 bg-rose-500 px-3 py-1 text-sm text-white">−{percentOff}%</span>}
      </div>

      <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
        <div>
          <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            <Timer size={14} aria-hidden="true" /> Limited-time offer
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{data.name}</h3>
          <p className="mt-3 leading-relaxed text-slate-600">{data.description}</p>
          {data.shop?.name && <p className="mt-3 text-sm text-slate-500">from <span className="font-medium text-slate-700">{data.shop.name}</span></p>}
        </div>

        <div className="space-y-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(onSale ? data.discountedPrice : data.price)}</span>
            {onSale && <span className="text-lg text-slate-400 line-through">{formatPrice(data.price)}</span>}
          </div>
          <Countdown targetDate={data.endDate} />
          <Link to={shopLink} className="btn-primary w-full sm:w-auto">
            Shop the deal <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default EventCard;
