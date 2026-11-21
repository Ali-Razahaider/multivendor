import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CalendarDays, LogOut, MapPin, MessageCircle, Package, Pencil, Phone, Star } from 'lucide-react'
import server from '../../server'
import { apiError } from '../../lib/api'
import { onImageError } from '../../lib/product'

// Shop header card shown on the public storefront and the seller's own shop page.
const ShopInfo = ({ isOwner }: { isOwner: boolean }) => {
  const { seller } = useSelector((state: any) => state.seller)
  const { isAuthenticated } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const shopId = isOwner ? seller?._id : id

  const [shop, setShop] = useState<any>(isOwner ? seller : null)
  const [products, setProducts] = useState<any[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!shopId) return
    let cancelled = false
    setStatus('loading')
    Promise.all([
      isOwner ? Promise.resolve({ data: { shop: seller } }) : axios.get(`${server}shop/get-shop-info/${shopId}`),
      axios.get(`${server}product/shop/${shopId}`),
    ])
      .then(([shopRes, productRes]) => {
        if (cancelled) return
        setShop(shopRes.data.shop)
        setProducts(productRes.data.products || [])
        setStatus('ready')
      })
      .catch(() => !cancelled && setStatus('missing'))
    return () => {
      cancelled = true
    }
  }, [shopId, isOwner, seller])

  const rated = products.filter((p) => (p.ratings ?? 0) > 0)
  const rating = rated.length ? rated.reduce((s, p) => s + p.ratings, 0) / rated.length : 0
  const sold = products.reduce((s, p) => s + (p.totalSell ?? 0), 0)

  const message = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setBusy(true)
    try {
      await axios.post(`${server}conversation/create-new-conversation`, { sellerId: shopId })
      navigate('/inbox')
    } catch (err) {
      toast.error(apiError(err, 'Couldn’t start a conversation'))
    } finally {
      setBusy(false)
    }
  }

  const logout = async () => {
    setBusy(true)
    try {
      await axios.post(`${server}shop/logout`)
      dispatch({ type: 'LoadSellerFail', payload: null })
      navigate('/shop-login')
    } catch (err) {
      toast.error(apiError(err))
      setBusy(false)
    }
  }

  if (status === 'missing') {
    return (
      <div className="card p-10 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Shop not found</h1>
        <p className="mt-1 text-slate-600">This shop may have closed.</p>
        <Link to="/products" className="btn-primary mt-5">Browse products</Link>
      </div>
    )
  }

  if (status === 'loading' || !shop) {
    return <div className="skeleton h-48 w-full rounded-3xl" />
  }

  const stats = [
    { icon: Package, label: 'Products', value: products.length },
    { icon: Star, label: 'Rating', value: rating ? rating.toFixed(1) : '—' },
    { icon: CalendarDays, label: 'Joined', value: new Date(shop.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) },
  ]

  return (
    <section className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 shadow-(--shadow-card)">
      <div className="h-28 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 sm:h-36" />
      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <img src={shop.avatar} onError={onImageError} alt="" className="h-24 w-24 rounded-2xl object-cover ring-4 ring-white shadow-md sm:h-28 sm:w-28" />
            <div className="pb-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{shop.name}</h1>
              {shop.address && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500"><MapPin size={14} /> {shop.address}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isOwner ? (
              <>
                <Link to="/dashboard" className="btn-primary">Dashboard</Link>
                <Link to="/settings" className="btn-secondary"><Pencil size={16} /> Edit shop</Link>
                <button type="button" onClick={logout} disabled={busy} className="btn-ghost"><LogOut size={16} /> Log out</button>
              </>
            ) : (
              <button type="button" onClick={message} disabled={busy} className="btn-primary">
                <MessageCircle size={17} /> Message shop
              </button>
            )}
          </div>
        </div>

        {shop.description && <p className="mt-5 max-w-3xl leading-relaxed text-slate-600">{shop.description}</p>}

        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-lg">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-100">
              <dt className="flex items-center justify-center gap-1 text-xs font-medium text-slate-500"><Icon size={13} /> {label}</dt>
              <dd className="mt-1 font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
        {sold > 0 && <p className="mt-3 text-sm text-slate-500">{sold.toLocaleString()} items sold</p>}
        {isOwner && shop.phoneNumber && (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500"><Phone size={14} /> {shop.phoneNumber}</p>
        )}
      </div>
    </section>
  )
}

export default ShopInfo
