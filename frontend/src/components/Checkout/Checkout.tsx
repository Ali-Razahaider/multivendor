import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Country, State } from 'country-state-city';
import { ArrowRight, MapPin, Tag, X } from 'lucide-react';
import server from '../../server';
import { apiError } from '../../lib/api';
import OrderSummary from './OrderSummary';
import { cartPayload, loadCheckout, saveCheckout, type Quote, type ShippingAddress } from './checkoutState';

const EMPTY_ADDRESS: ShippingAddress = { address1: '', address2: '', city: '', state: '', country: '', zipCode: '' };

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.user);
  const { cart } = useSelector((state: any) => state.cart);
  const saved = useMemo(() => loadCheckout(), []);

  const [address, setAddress] = useState<ShippingAddress>(saved?.shippingAddress || EMPTY_ADDRESS);
  const [couponInput, setCouponInput] = useState('');
  const [couponCode, setCouponCode] = useState<string | null>(saved?.couponCode || null);
  const [couponError, setCouponError] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const cartKey = JSON.stringify(cartPayload(cart || []));

  const fetchQuote = useCallback(
    async (code: string | null) => {
      setLoading(true);
      try {
        const { data } = await axios.post(`${server}payment/quote`, { cart: JSON.parse(cartKey), couponCode: code || undefined });
        setQuote(data.quote);
        setQuoteError('');
        return true;
      } catch (err) {
        const message = apiError(err, 'We couldn’t price your cart.');
        if (code) {
          // Retry without the coupon so the summary still shows.
          setCouponError(message);
          setCouponCode(null);
        } else {
          setQuoteError(message);
          setQuote(null);
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cartKey]
  );

  useEffect(() => {
    if (!cart?.length) return;
    fetchQuote(couponCode);
  }, [cartKey, couponCode, fetchQuote, cart?.length]);

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim();
    if (!code) return;
    setCouponError('');
    setCouponCode(code);
    setCouponInput('');
  };

  const set = (field: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [field]: e.target.value, ...(field === 'country' ? { state: '' } : {}) }));

  const states = address.country ? State.getStatesOfCountry(address.country) : [];
  const missing = {
    country: !address.country,
    state: states.length > 0 && !address.state,
    city: !address.city.trim(),
    address1: !address.address1.trim(),
    zipCode: !String(address.zipCode).trim(),
  };
  const valid = !Object.values(missing).some(Boolean);

  const applySavedAddress = (a: any) =>
    setAddress({
      address1: a.address1 || '',
      address2: a.address2 || '',
      city: a.city || '',
      state: a.state || '',
      country: a.country || '',
      zipCode: String(a.zipCode || ''),
    });

  const continueToPayment = () => {
    setTouched(true);
    if (!valid || !quote) return;
    saveCheckout({ shippingAddress: address, couponCode: quote.couponCode });
    navigate('/payment');
  };

  if (!cart?.length) {
    return (
      <div className="card mx-auto mt-10 max-w-lg p-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-slate-600">Add a few things to your cart before checking out.</p>
        <Link to="/products" className="btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const fieldClass = (bad: boolean) => `field ${touched && bad ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''}`;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]">
      <section className="card p-5 sm:p-7" aria-labelledby="shipping-heading">
        <h2 id="shipping-heading" className="text-lg font-bold text-slate-900">Shipping details</h2>
        <p className="mt-1 text-sm text-slate-500">Delivering to {user?.name} · {user?.email}</p>

        {user?.addresses?.length > 0 && (
          <div className="mt-5">
            <p className="field-label">Saved addresses</p>
            <div className="flex flex-wrap gap-2">
              {user.addresses.map((a: any) => (
                <button
                  key={a._id || a.addressType}
                  type="button"
                  onClick={() => applySavedAddress(a)}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ring-1 ring-slate-200 hover:bg-brand-50 hover:ring-brand-200"
                >
                  <MapPin size={15} className="text-brand-600" />
                  <span>
                    <span className="block font-semibold text-slate-800">{a.addressType}</span>
                    <span className="block text-xs text-slate-500">{a.address1}, {a.city}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); continueToPayment(); }} noValidate>
          <div className="sm:col-span-2">
            <label htmlFor="address1" className="field-label">Street address *</label>
            <input id="address1" autoComplete="address-line1" className={fieldClass(missing.address1)} value={address.address1} onChange={set('address1')} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address2" className="field-label">Apartment, suite, etc. <span className="font-normal text-slate-400">(optional)</span></label>
            <input id="address2" autoComplete="address-line2" className="field" value={address.address2} onChange={set('address2')} />
          </div>
          <div>
            <label htmlFor="country" className="field-label">Country *</label>
            <select id="country" autoComplete="country" className={fieldClass(missing.country)} value={address.country} onChange={set('country')}>
              <option value="">Choose country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="state" className="field-label">State / Province{states.length > 0 ? ' *' : ''}</label>
            <select id="state" className={fieldClass(missing.state)} value={address.state} onChange={set('state')} disabled={!states.length}>
              <option value="">{states.length ? 'Choose state' : 'Not applicable'}</option>
              {states.map((s) => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="city" className="field-label">City *</label>
            <input id="city" autoComplete="address-level2" className={fieldClass(missing.city)} value={address.city} onChange={set('city')} />
          </div>
          <div>
            <label htmlFor="zip" className="field-label">ZIP / Postal code *</label>
            <input id="zip" autoComplete="postal-code" className={fieldClass(missing.zipCode)} value={address.zipCode} onChange={set('zipCode')} />
          </div>
          {touched && !valid && (
            <p className="text-sm text-rose-600 sm:col-span-2" role="alert">Please fill in the highlighted fields.</p>
          )}
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </section>

      <OrderSummary quote={quote} loading={loading} error={quoteError}>
        {quote?.couponCode ? (
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
            <span className="inline-flex items-center gap-2 font-medium"><Tag size={15} /> {quote.couponCode} applied</span>
            <button type="button" aria-label="Remove coupon" onClick={() => setCouponCode(null)} className="rounded-lg p-1 hover:bg-emerald-100">
              <X size={15} />
            </button>
          </div>
        ) : (
          <form onSubmit={applyCoupon}>
            <label htmlFor="coupon" className="field-label">Coupon code</label>
            <div className="flex gap-2">
              <input id="coupon" className="field" placeholder="Enter code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
              <button type="submit" className="btn-secondary" disabled={!couponInput.trim() || loading}>Apply</button>
            </div>
            {couponError && <p className="mt-2 text-sm text-rose-600" role="alert">{couponError}</p>}
          </form>
        )}
        <button type="button" onClick={continueToPayment} disabled={!quote || loading} className="btn-primary mt-5 h-12 w-full text-base">
          Continue to payment <ArrowRight size={18} />
        </button>
        <Link to="/products" className="mt-3 block text-center text-sm font-medium text-slate-500 hover:text-slate-800">Continue shopping</Link>
      </OrderSummary>
    </div>
  );
};

export default Checkout;
