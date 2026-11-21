import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AlertTriangle, ArrowRight, DollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react'
import server from '../../server'
import { formatPrice, onImageError, productImage } from '../../lib/product'

const STATUS_STYLES: Record<string, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-slate-100 text-slate-600',
  'Processing refund': 'bg-amber-50 text-amber-700',
  'Refund Success': 'bg-rose-50 text-rose-700',
}

// Seller overview: balance, order and product stats, latest orders, low stock.
function DashboardHero() {
  const { seller } = useSelector((state: any) => state.seller)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!seller?._id) return
    Promise.all([axios.get(`${server}order/seller-orders`), axios.get(`${server}product/shop/${seller._id}`)])
      .then(([o, p]) => {
        setOrders(o.data.orders || [])
        setProducts(p.data.products || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [seller?._id])

  const delivered = orders.filter((o) => o.status === 'Delivered')
  const revenue = delivered.reduce((s, o) => s + (o.subTotalPrice ? o.subTotalPrice - (o.discountPrice || 0) : o.totalPrice || 0), 0)
  const open = orders.filter((o) => !['Delivered', 'Cancelled', 'Refund Success', 'Refund Rejected'].includes(o.status))
  const lowStock = products.filter((p) => (p.countInStock ?? 0) <= 5).slice(0, 5)

  const stats = [
    { icon: DollarSign, label: 'Available balance', value: formatPrice(seller?.availableBalance || 0), hint: 'After the 10% platform fee', link: '/dashboard-withdraw-money', linkText: 'Withdraw' },
    { icon: TrendingUp, label: 'Delivered sales', value: formatPrice(revenue), hint: `${delivered.length} delivered orders`, link: '/dashboard-orders', linkText: 'View orders' },
    { icon: ShoppingBag, label: 'Open orders', value: String(open.length), hint: `${orders.length} orders in total`, link: '/dashboard-orders', linkText: 'Manage' },
    { icon: Package, label: 'Products', value: String(products.length), hint: `${lowStock.length} low on stock`, link: '/dashboard-products', linkText: 'View products' },
  ]

  return (
    <div className="w-full max-w-6xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back{seller?.name ? `, ${seller.name}` : ''}</h1>
      <p className="mt-1 text-sm text-slate-600">Here’s how your shop is doing.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, hint, link, linkText }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><Icon size={16} /></span>
              {label}
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{loading && label !== 'Available balance' ? '—' : value}</p>
            <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
            <Link to={link} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
              {linkText} <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Latest orders</h2>
            <Link to="/dashboard-orders" className="text-sm font-semibold text-brand-700 hover:underline">See all</Link>
          </div>
          {orders.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">{loading ? 'Loading…' : 'No orders yet. Share your shop to get your first sale!'}</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {orders.slice(0, 6).map((o) => (
                <li key={o._id}>
                  <Link to={`/dashboard-order/${o._id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">#{o._id.slice(-8).toUpperCase()} · {o.user?.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString()} · {o.cart?.reduce((n: number, i: any) => n + (i.qty || 1), 0)} items · {o.paymentInfo?.type}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_STYLES[o.status] || 'bg-brand-50 text-brand-700'}`}>{o.status}</span>
                    <span className="w-20 text-right text-sm font-semibold text-slate-900">{formatPrice(o.totalPrice)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900"><AlertTriangle size={16} className="text-amber-500" /> Low stock</h2>
          {lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">All products are well stocked.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <li key={p._id} className="flex items-center gap-3">
                  <img src={productImage(p)} onError={onImageError} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <span className="min-w-0 flex-1 truncate text-sm text-slate-800">{p.name}</span>
                  <span className={`badge ${p.countInStock === 0 ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{p.countInStock} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardHero
