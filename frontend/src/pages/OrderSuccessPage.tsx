import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'
import Footer from '../components/Layout/Footer'
import Header from '../components/Layout/Header'
import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import { loadLastOrders } from '../components/Checkout/checkoutState'
import { formatPrice } from '../lib/product'
import { shortId } from '../components/Profile/orderUtils'

const OrderSuccessPage = () => {
  const orders = useMemo(() => loadLastOrders(), [])
  const total = orders.reduce((s: number, o: any) => s + (o.totalPrice || 0), 0)

  return (
    <>
      <Header />
      <main id="main" className="container-page py-10">
        <CheckoutSteps active={4} />
        <div className="card mx-auto mt-10 max-w-xl p-8 text-center sm:p-10">
          <CheckCircle2 size={56} className="mx-auto text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Thank you for your order!</h1>
          <p className="mt-2 text-slate-600">We’ve emailed you a confirmation. You can follow your order’s progress from your account.</p>

          {orders.length > 0 ? (
            <ul className="mt-6 divide-y divide-slate-100 rounded-2xl text-left ring-1 ring-slate-200">
              {orders.map((o: any) => (
                <li key={o._id} className="flex items-center justify-between gap-3 p-4">
                  <span className="flex items-center gap-3">
                    <Package size={18} className="text-brand-600" />
                    <span>
                      <span className="block text-sm font-semibold text-slate-900">Order {shortId(o._id)}</span>
                      <span className="block text-xs text-slate-500">{(o.cart || []).length} item(s) · {formatPrice(o.totalPrice)}</span>
                    </span>
                  </span>
                  <Link to={`/user/order/${o._id}`} className="text-sm font-semibold text-brand-700 hover:text-brand-600">View</Link>
                </li>
              ))}
              {orders.length > 1 && (
                <li className="flex justify-between p-4 text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </li>
              )}
            </ul>
          ) : (
            <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Your payment was received and your order is being finalized. It will appear in your orders shortly.</p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/profile?tab=orders" className="btn-primary">View my orders</Link>
            <Link to="/products" className="btn-secondary">Continue shopping</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default OrderSuccessPage
