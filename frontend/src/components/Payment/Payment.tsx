import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Banknote, CreditCard, Lock, MapPin } from 'lucide-react';
import server from '../../server';
import { apiError } from '../../lib/api';
import { formatPrice } from '../../lib/product';
import { clearCart } from '../../redux/actions/cartActions';
import OrderSummary from '../Checkout/OrderSummary';
import { cartPayload, loadCheckout, saveCheckout, saveLastOrders, type Quote } from '../Checkout/checkoutState';

type Method = 'card' | 'cod';

const CARD_STYLE = {
  style: {
    base: {
      fontSize: '15px',
      color: '#0f172a',
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
      '::placeholder': { color: '#94a3b8' },
    },
    invalid: { color: '#e11d48' },
  },
  hidePostalCode: true,
};

const Payment = ({ cardEnabled }: { cardEnabled: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useSelector((state: any) => state.user);
  const { cart } = useSelector((state: any) => state.cart);
  const checkout = useMemo(() => loadCheckout(), []);

  const [method, setMethod] = useState<Method>(cardEnabled ? 'card' : 'cod');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [cardholder, setCardholder] = useState(user?.name || '');
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const done = useRef(false);

  const payload = useMemo(
    () => ({ cart: cartPayload(cart || []), couponCode: checkout?.couponCode || undefined, shippingAddress: checkout?.shippingAddress }),
    [cart, checkout]
  );

  useEffect(() => {
    if (done.current) return;
    if (!checkout?.shippingAddress || !cart?.length) {
      navigate('/checkout', { replace: true });
      return;
    }
    axios
      .post(`${server}payment/quote`, { cart: payload.cart, couponCode: payload.couponCode })
      .then(({ data }) => setQuote(data.quote))
      .catch((err) => setQuoteError(apiError(err, 'We couldn’t price your cart.')));
  }, [checkout, cart?.length, navigate, payload]);

  const finish = (orders: any[]) => {
    done.current = true;
    saveLastOrders(orders);
    saveCheckout(null);
    dispatch(clearCart() as any);
    navigate('/order/success', { replace: true });
  };

  const payByCard = async () => {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;

    const { data } = await axios.post(`${server}payment/process`, payload);
    const result = await stripe.confirmCardPayment(data.client_secret, {
      payment_method: { card, billing_details: { name: cardholder.trim() || user?.name, email: user?.email } },
    });
    if (result.error) {
      setCardError(result.error.message || 'Your card was declined.');
      return;
    }
    if (result.paymentIntent?.status !== 'succeeded') {
      setCardError('Payment was not completed. Please try again.');
      return;
    }
    try {
      const res = await axios.post(`${server}payment/confirm`, { paymentIntentId: data.paymentIntentId });
      finish(res.data.orders || []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.error(apiError(err));
        navigate('/checkout');
        return;
      }
      // Payment succeeded; the webhook will create the order even if this call failed.
      toast.info('Payment received — your order is being finalized.');
      finish([]);
    }
  };

  const payOnDelivery = async () => {
    const { data } = await axios.post(`${server}order/create-order`, payload);
    finish(data.orders || []);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setSubmitting(true);
    setCardError('');
    try {
      if (method === 'card') await payByCard();
      else await payOnDelivery();
    } catch (err) {
      const message = apiError(err, 'We couldn’t place your order.');
      if (method === 'card') setCardError(message);
      else toast.error(message);
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };

  const address = checkout?.shippingAddress;
  const canSubmit = !!quote && !submitting && (method === 'cod' || (cardComplete && !!stripe));

  const option = (value: Method, icon: React.ReactNode, title: string, text: string, disabled = false) => (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition ${
        method === value ? 'bg-brand-50/60 ring-2 ring-brand-500' : 'ring-slate-200 hover:ring-slate-300'
      } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input type="radio" name="method" value={value} checked={method === value} onChange={() => setMethod(value)} disabled={disabled} className="mt-1 accent-brand-600" />
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 ring-1 ring-slate-200">{icon}</span>
      <span>
        <span className="block font-semibold text-slate-900">{title}</span>
        <span className="block text-sm text-slate-500">{text}</span>
      </span>
    </label>
  );

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
      <form onSubmit={submit} className="space-y-6">
        {address && (
          <section className="card flex items-start justify-between gap-4 p-5">
            <div className="flex gap-3">
              <MapPin size={20} className="mt-0.5 text-brand-600" />
              <div className="text-sm">
                <p className="font-semibold text-slate-900">Shipping to {user?.name}</p>
                <p className="text-slate-600">
                  {[address.address1, address.address2, address.city, address.state, address.zipCode, address.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>
            <Link to="/checkout" className="text-sm font-semibold text-brand-700 hover:text-brand-600">Change</Link>
          </section>
        )}

        <section className="card p-5 sm:p-7" aria-labelledby="pay-heading">
          <h2 id="pay-heading" className="text-lg font-bold text-slate-900">Payment method</h2>
          <div className="mt-4 grid gap-3">
            {option('card', <CreditCard size={20} />, 'Credit or debit card', cardEnabled ? 'Visa, Mastercard, Amex and more' : 'Card payments are currently unavailable', !cardEnabled)}
            {option('cod', <Banknote size={20} />, 'Cash on delivery', 'Pay in cash when your order arrives')}
          </div>

          {method === 'card' && cardEnabled && (
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="cardholder" className="field-label">Name on card</label>
                <input id="cardholder" autoComplete="cc-name" className="field" value={cardholder} onChange={(e) => setCardholder(e.target.value)} required />
              </div>
              <div>
                <span className="field-label">Card details</span>
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3.5 shadow-xs focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/15">
                  <CardElement
                    options={CARD_STYLE}
                    onChange={(e) => {
                      setCardComplete(e.complete);
                      setCardError(e.error?.message || '');
                    }}
                  />
                </div>
              </div>
              {cardError && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">{cardError}</p>}
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <Lock size={13} /> Payments are encrypted and processed securely by Stripe. We never store your card details.
              </p>
            </div>
          )}
        </section>

        <button type="submit" disabled={!canSubmit} className="btn-primary h-12 w-full text-base lg:hidden">
          {submitting ? 'Processing…' : method === 'card' ? `Pay ${quote ? formatPrice(quote.total) : ''}` : 'Place order'}
        </button>
      </form>

      <OrderSummary quote={quote} loading={!quote && !quoteError} error={quoteError}>
        <button type="button" onClick={submit} disabled={!canSubmit} className="btn-primary hidden h-12 w-full text-base lg:flex">
          {submitting ? 'Processing…' : method === 'card' ? `Pay ${quote ? formatPrice(quote.total) : ''}` : 'Place order'}
        </button>
        <p className="mt-3 text-center text-xs text-slate-500">By placing your order you agree to the shop’s return policy.</p>
      </OrderSummary>
    </div>
  );
};

export default Payment;
