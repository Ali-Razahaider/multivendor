import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BadgeCheck } from 'lucide-react'
import server from '../../server'
import { ProductGrid } from '../ProductCard/ProductCard'
import EventCard from '../Home/EventCard'
import Ratings from '../Ratings'
import { isCurrentEvent } from '../../utils/events'
import { onImageError, type Product } from '../../lib/product'

const ShopProfileData = ({ isOwner }: { isOwner: boolean }) => {
  const { seller } = useSelector((state: any) => state.seller)
  const { id } = useParams()
  const shopId = isOwner ? seller?._id : id
  const [tab, setTab] = useState<'products' | 'events' | 'reviews'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!shopId) return
    let cancelled = false
    setLoading(true)
    Promise.all([axios.get(`${server}product/shop/${shopId}`), axios.get(`${server}event/shop/${shopId}`)])
      .then(([p, e]) => {
        if (cancelled) return
        setProducts(p.data.products || [])
        setEvents((e.data.events || []).filter(isCurrentEvent))
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [shopId])

  const reviews = products.flatMap((p) => (p.reviews || []).map((r) => ({ ...r, productName: p.name })))
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

  const tabs = [
    { key: 'products', label: `Products (${products.length})` },
    { key: 'events', label: `Offers (${events.length})` },
    { key: 'reviews', label: `Reviews (${reviews.length})` },
  ] as const

  return (
    <section className="mt-8">
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 scrollbar-none" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${tab === t.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="py-8" role="tabpanel">
        {tab === 'products' &&
          (!loading && products.length === 0 ? (
            <p className="card p-10 text-center text-slate-600">{isOwner ? 'You haven’t listed any products yet.' : 'This shop has no products yet.'}</p>
          ) : (
            <ProductGrid products={products} loading={loading} />
          ))}

        {tab === 'events' &&
          (events.length === 0 ? (
            <p className="card p-10 text-center text-slate-600">No running offers right now.</p>
          ) : (
            <div className="space-y-6">
              {events.map((e) => <EventCard key={e._id} data={e} />)}
            </div>
          ))}

        {tab === 'reviews' &&
          (reviews.length === 0 ? (
            <p className="card p-10 text-center text-slate-600">No reviews yet.</p>
          ) : (
            <ul className="card divide-y divide-slate-100 px-5">
              {reviews.map((r, i) => (
                <li key={i} className="flex gap-4 py-5">
                  <img src={r.user?.avatar?.url} onError={onImageError} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900">{r.user?.name || 'Shopper'}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><BadgeCheck size={14} /> Verified purchase</span>
                    </div>
                    <Ratings rating={r.rating} size={14} className="mt-1" />
                    {r.comment && <p className="mt-2 text-slate-700">{r.comment}</p>}
                    <p className="mt-1 text-xs text-slate-400">on {r.productName}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
      </div>
    </section>
  )
}

export default ShopProfileData
