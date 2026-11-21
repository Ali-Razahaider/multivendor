import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ArrowLeft, MapPin, CreditCard, Star, RotateCcw, X } from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Loader from '../components/Layout/Loader'
import OrderTracker, { useOrder } from '../components/Profile/OrderTracker'
import { StatusBadge, itemImage, orderDate, paymentLabel, shortId } from '../components/Profile/orderUtils'
import { FALLBACK_IMAGE, formatPrice, isObjectId, onImageError, sizedImage } from '../lib/product'
import { apiError } from '../lib/api'
import server from '../server'

const ReviewDialog = ({ item, orderId, onClose, onDone }) => {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please choose a star rating')
    setSaving(true)
    try {
      const { data } = await axios.put(`${server}product/create-new-review`, { productId: item._id, orderId, rating, comment })
      toast.success(data.message || 'Thanks for your review!')
      onDone()
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="review-title">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-slate-950/50" onClick={onClose} />
      <form onSubmit={submit} className="card relative w-full max-w-md p-6 animate-fade-in">
        <button type="button" aria-label="Close" onClick={onClose} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl hover:bg-slate-100">
          <X size={18} />
        </button>
        <h2 id="review-title" className="text-lg font-bold text-slate-900">Review your purchase</h2>
        <div className="mt-4 flex items-center gap-3">
          <img src={sizedImage(itemImage(item) || FALLBACK_IMAGE, 120)} onError={onImageError} alt="" className="h-14 w-14 rounded-xl object-cover" />
          <p className="text-sm font-medium text-slate-800">{item.name}</p>
        </div>
        <fieldset className="mt-5">
          <legend className="field-label">Your rating</legend>
          <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                aria-pressed={rating === n}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
                className="rounded-lg p-1"
              >
                <Star size={30} className={(hover || rating) >= n ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
              </button>
            ))}
          </div>
        </fieldset>
        <label htmlFor="review-comment" className="field-label mt-4">Comment <span className="font-normal text-slate-400">(optional)</span></label>
        <textarea
          id="review-comment"
          rows={4}
          maxLength={2000}
          className="field h-auto py-2.5"
          placeholder="What did you like or dislike?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Submitting…' : 'Submit review'}</button>
        </div>
      </form>
    </div>
  )
}

const OrderDetailsPage = () => {
  const { id } = useParams()
  const { order, error, loading, reload, setOrder } = useOrder(id)
  const [reviewing, setReviewing] = useState(null)
  const [requesting, setRequesting] = useState(false)

  const requestRefund = async () => {
    if (!window.confirm('Request a refund for this order? The seller will review your request.')) return
    setRequesting(true)
    try {
      const { data } = await axios.put(`${server}order/order-refund/${order._id}`)
      setOrder(data.order)
      toast.success(data.message || 'Refund requested')
    } catch (err) {
      toast.error(apiError(err))
    } finally {
      setRequesting(false)
    }
  }

  const address = order?.shippingAddress || {}
  const subTotal = order?.subTotalPrice || (order?.cart || []).reduce((s, i) => s + (i.discountedPrice || i.price || 0) * (i.qty || 1), 0)
  const delivered = order?.status === 'Delivered'

  return (
    <>
      <Header />
      <main id="main" className="container-page max-w-5xl py-10">
        <Link to="/profile?tab=orders" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} /> Back to my orders
        </Link>

        {loading && !order ? (
          <Loader label="Loading order" />
        ) : error ? (
          <div className="card mt-6 p-8 text-center text-slate-600">{error}</div>
        ) : order ? (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Order {shortId(order._id)}</h1>
                <p className="mt-1 text-sm text-slate-500">Placed {orderDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={order.status} />
                {delivered && (
                  <button type="button" onClick={requestRefund} disabled={requesting} className="btn-secondary h-9 px-3 text-xs">
                    <RotateCcw size={15} /> {requesting ? 'Requesting…' : 'Request refund'}
                  </button>
                )}
              </div>
            </div>

            <section className="card p-5 sm:p-7">
              <OrderTracker status={order.status} />
            </section>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="card p-5 sm:p-7" aria-labelledby="items-heading">
                <h2 id="items-heading" className="text-lg font-bold text-slate-900">Items</h2>
                <ul className="mt-4 divide-y divide-slate-100">
                  {(order.cart || []).map((item, i) => {
                    const unit = item.discountedPrice || item.price || 0
                    return (
                      <li key={item._id || i} className="flex flex-wrap items-center gap-4 py-4">
                        <img src={sizedImage(itemImage(item) || FALLBACK_IMAGE, 160)} onError={onImageError} alt="" className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200" />
                        <div className="min-w-0 flex-1">
                          {isObjectId(item._id) ? (
                            <Link to={`/product/${item._id}`} className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-700">{item.name}</Link>
                          ) : (
                            <p className="line-clamp-2 text-sm font-semibold text-slate-900">{item.name}</p>
                          )}
                          <p className="mt-0.5 text-xs text-slate-500">{item.qty} × {formatPrice(unit)}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-sm font-bold text-slate-900">{formatPrice(item.lineTotal ?? unit * (item.qty || 1))}</span>
                          {delivered && !item.isReviewed && isObjectId(item._id) && (
                            <button type="button" onClick={() => setReviewing(item)} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-600">
                              <Star size={13} /> Write a review
                            </button>
                          )}
                          {item.isReviewed && <span className="text-xs text-emerald-700">Reviewed</span>}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <div className="space-y-6">
                <section className="card p-5 sm:p-6">
                  <h2 className="text-base font-bold text-slate-900">Summary</h2>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600"><dt>Subtotal</dt><dd className="font-medium text-slate-900">{formatPrice(subTotal)}</dd></div>
                    {order.shippingPrice != null && (
                      <div className="flex justify-between text-slate-600"><dt>Shipping</dt><dd className="font-medium text-slate-900">{order.shippingPrice > 0 ? formatPrice(order.shippingPrice) : 'Free'}</dd></div>
                    )}
                    {order.discountPrice > 0 && (
                      <div className="flex justify-between text-emerald-700"><dt>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt><dd>−{formatPrice(order.discountPrice)}</dd></div>
                    )}
                    <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900"><dt>Total</dt><dd>{formatPrice(order.totalPrice)}</dd></div>
                  </dl>
                </section>
                <section className="card space-y-4 p-5 text-sm sm:p-6">
                  <div className="flex gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Shipping address</p>
                      <p className="text-slate-600">{[address.address1, address.address2, address.city, address.state, address.zipCode, address.country].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CreditCard size={18} className="mt-0.5 shrink-0 text-brand-600" />
                    <div>
                      <p className="font-semibold text-slate-900">Payment</p>
                      <p className="text-slate-600">{paymentLabel(order)}</p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
      {reviewing && (
        <ReviewDialog
          item={reviewing}
          orderId={order?._id}
          onClose={() => setReviewing(null)}
          onDone={() => {
            setReviewing(null)
            reload()
          }}
        />
      )}
    </>
  )
}

export default OrderDetailsPage
