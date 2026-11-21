import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Country, State } from 'country-state-city';
import { Camera, ChevronRight, MapPin, Package, Plus, Trash2 } from 'lucide-react';
import server from '../../server.js';
import { apiError, PASSWORD_RULES, passwordIsStrong } from '../../lib/api';
import { FALLBACK_IMAGE, formatPrice, onImageError, sizedImage } from '../../lib/product';
import UserInbox from '../../pages/UserInbox';
import { StatusBadge, isRefundStatus, itemCount, itemImage, orderDate, shortId } from './orderUtils';
import type { ProfileTab } from './ProfileSidebar';

const setUser = (dispatch, user) => dispatch({ type: 'LoadUserSuccess', payload: user });

const Panel = ({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <section className="card p-5 sm:p-7">
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

/* ---------- Profile ---------- */

const ProfileTabPanel = () => {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '' });
  const [emailPassword, setEmailPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pw, setPw] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phoneNumber: user.phoneNumber || '' });
  }, [user]);

  const emailChanged = !!user && form.email.trim().toLowerCase() !== (user.email || '').toLowerCase();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file');
    if (file.size > 5 * 1024 * 1024) return toast.error('Images must be smaller than 5MB');
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        const { data } = await axios.put(`${server}user/update-avatar`, { avatar: reader.result });
        setUser(dispatch, data.user);
        toast.success('Profile photo updated');
      } catch (err) {
        toast.error(apiError(err));
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, string> = { name: form.name, phoneNumber: form.phoneNumber, email: form.email };
      if (emailChanged) body.oldPassword = emailPassword;
      const { data } = await axios.put(`${server}user/update-profile`, body);
      setUser(dispatch, data.user);
      setEmailPassword('');
      toast.success('Profile updated');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast.error('New passwords don’t match');
    if (!passwordIsStrong(pw.newPassword)) return toast.error('Choose a stronger password');
    setSavingPw(true);
    try {
      const { data } = await axios.put(`${server}user/update-profile`, { oldPassword: pw.oldPassword, newPassword: pw.newPassword });
      setUser(dispatch, data.user);
      setPw({ oldPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Personal details" subtitle="Update your name, contact details and photo.">
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <img src={user?.avatar?.url} alt="" className={`h-20 w-20 rounded-full object-cover ring-2 ring-white shadow ${uploading ? 'opacity-50' : ''}`} />
            <label className="absolute -bottom-1 -right-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-brand-600 text-white shadow ring-2 ring-white hover:bg-brand-700">
              <input type="file" className="sr-only" accept="image/*" onChange={handleImage} disabled={uploading} />
              <Camera size={15} />
              <span className="sr-only">Change profile photo</span>
            </label>
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name}</p>
            <p className="text-sm text-slate-500">{uploading ? 'Uploading photo…' : `Member since ${orderDate(user?.createdAt)}`}</p>
          </div>
        </div>
        <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-name" className="field-label">Full name</label>
            <input id="p-name" autoComplete="name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
          </div>
          <div>
            <label htmlFor="p-phone" className="field-label">Phone number</label>
            <input id="p-phone" type="tel" autoComplete="tel" className="field" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="p-email" className="field-label">Email address</label>
            <input id="p-email" type="email" autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          {emailChanged && (
            <div className="sm:col-span-2">
              <label htmlFor="p-email-pw" className="field-label">Current password (required to change email)</label>
              <input id="p-email-pw" type="password" autoComplete="current-password" className="field" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} required />
            </div>
          )}
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </Panel>

      <Panel title="Change password" subtitle="Changing your password signs you out on other devices.">
        <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="pw-old" className="field-label">Current password</label>
            <input id="pw-old" type="password" autoComplete="current-password" className="field" value={pw.oldPassword} onChange={(e) => setPw({ ...pw, oldPassword: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="pw-new" className="field-label">New password</label>
            <input id="pw-new" type="password" autoComplete="new-password" className="field" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="pw-confirm" className="field-label">Confirm new password</label>
            <input id="pw-confirm" type="password" autoComplete="new-password" className="field" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required />
          </div>
          {pw.newPassword && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:col-span-2">
              {PASSWORD_RULES.map((r) => (
                <li key={r.label} className={r.test(pw.newPassword) ? 'text-emerald-700' : 'text-slate-400'}>✓ {r.label}</li>
              ))}
            </ul>
          )}
          <div className="sm:col-span-2">
            <button type="submit" className="btn-dark" disabled={savingPw}>{savingPw ? 'Updating…' : 'Update password'}</button>
          </div>
        </form>
      </Panel>
    </div>
  );
};

/* ---------- Orders ---------- */

const useMyOrders = () => {
  const [orders, setOrders] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    axios
      .get(`${server}order/my-orders`)
      .then(({ data }) => setOrders(data.orders || []))
      .catch((err) => {
        setError(apiError(err, 'We couldn’t load your orders.'));
        setOrders([]);
      });
  }, []);
  return { orders, error };
};

const OrderList = ({ orders, linkTo, empty }: { orders: any[]; linkTo: (o: any) => string; empty: string }) => {
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Package size={24} /></span>
        <p className="text-slate-600">{empty}</p>
        <Link to="/products" className="btn-primary">Start shopping</Link>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o._id}>
          <Link to={linkTo(o)} className="flex items-center gap-4 rounded-2xl p-3 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300 sm:p-4">
            <div className="flex -space-x-3">
              {(o.cart || []).slice(0, 3).map((item, i) => (
                <img key={i} src={sizedImage(itemImage(item) || FALLBACK_IMAGE, 120)} onError={onImageError} alt="" className="h-12 w-12 rounded-xl object-cover ring-2 ring-white" />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-900">{shortId(o._id)}</span>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-0.5 truncate text-sm text-slate-500">
                {orderDate(o.createdAt)} · {itemCount(o)} item{itemCount(o) === 1 ? '' : 's'} · {o.cart?.[0]?.shopName || o.cart?.[0]?.name}
              </p>
            </div>
            <span className="hidden font-bold text-slate-900 sm:block">{formatPrice(o.totalPrice)}</span>
            <ChevronRight size={18} className="text-slate-400" />
          </Link>
        </li>
      ))}
    </ul>
  );
};

const OrdersPanel = ({ mode }: { mode: 'orders' | 'refunds' }) => {
  const { orders, error } = useMyOrders();
  const config = {
    orders: { title: 'Your orders', subtitle: 'Every purchase, newest first.', empty: 'You haven’t placed any orders yet.', link: (o) => `/user/order/${o._id}` },
    refunds: { title: 'Refunds', subtitle: 'Refund requests on delivered orders.', empty: 'You have no refund requests.', link: (o) => `/user/order/${o._id}` },
  }[mode];

  const list = (orders || []).filter((o) =>
    mode === 'refunds' ? isRefundStatus(o.status) : true
  );

  return (
    <Panel title={config.title} subtitle={config.subtitle}>
      {error && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {orders === null ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="skeleton h-20" />)}
        </div>
      ) : (
        <OrderList orders={list} linkTo={config.link} empty={config.empty} />
      )}
    </Panel>
  );
};

/* ---------- Addresses ---------- */

const ADDRESS_TYPES = ['Default', 'Home', 'Office'];
const EMPTY = { country: '', state: '', city: '', address1: '', address2: '', zipCode: '', addressType: '' };

const AddressesPanel = () => {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const addresses = user?.addresses || [];
  const usedTypes = addresses.map((a) => a.addressType);
  const states = form.country ? State.getStatesOfCountry(form.country) : [];

  const set = (field: keyof typeof EMPTY) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value, ...(field === 'country' ? { state: '' } : {}) }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.put(`${server}user/update-user-addresses`, form);
      setUser(dispatch, data.user);
      setForm(EMPTY);
      setAdding(false);
      toast.success('Address saved');
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      const { data } = await axios.delete(`${server}user/delete-user-address/${id}`);
      setUser(dispatch, data.user);
      toast.success('Address deleted');
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const countryName = (code: string) => Country.getCountryByCode(code)?.name || code;

  return (
    <Panel
      title="Saved addresses"
      subtitle="Use these to check out faster."
      action={
        !adding && usedTypes.length < ADDRESS_TYPES.length ? (
          <button type="button" className="btn-primary h-10" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add address
          </button>
        ) : undefined
      }
    >
      {adding && (
        <form onSubmit={save} className="mb-6 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 sm:p-5">
          <div>
            <label htmlFor="a-type" className="field-label">Label *</label>
            <select id="a-type" className="field" value={form.addressType} onChange={set('addressType')} required>
              <option value="">Choose</option>
              {ADDRESS_TYPES.filter((t) => !usedTypes.includes(t)).map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="a-country" className="field-label">Country *</label>
            <select id="a-country" className="field" value={form.country} onChange={set('country')} required>
              <option value="">Choose country</option>
              {Country.getAllCountries().map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="a-state" className="field-label">State / Province</label>
            <select id="a-state" className="field" value={form.state} onChange={set('state')} disabled={!states.length}>
              <option value="">{states.length ? 'Choose state' : 'Not applicable'}</option>
              {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="a-city" className="field-label">City *</label>
            <input id="a-city" className="field" value={form.city} onChange={set('city')} required />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="a-line1" className="field-label">Street address *</label>
            <input id="a-line1" autoComplete="address-line1" className="field" value={form.address1} onChange={set('address1')} required />
          </div>
          <div>
            <label htmlFor="a-line2" className="field-label">Apartment, suite, etc.</label>
            <input id="a-line2" autoComplete="address-line2" className="field" value={form.address2} onChange={set('address2')} />
          </div>
          <div>
            <label htmlFor="a-zip" className="field-label">ZIP / Postal code *</label>
            <input id="a-zip" autoComplete="postal-code" className="field" value={form.zipCode} onChange={set('zipCode')} required />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save address'}</button>
            <button type="button" className="btn-ghost" onClick={() => { setAdding(false); setForm(EMPTY); }}>Cancel</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !adding ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-500"><MapPin size={24} /></span>
          <p className="text-slate-600">You haven’t saved any addresses yet.</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a._id} className="flex items-start justify-between gap-3 rounded-2xl p-4 ring-1 ring-slate-200">
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 text-brand-600" />
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">{a.addressType}</p>
                  <p className="text-slate-600">{[a.address1, a.address2].filter(Boolean).join(', ')}</p>
                  <p className="text-slate-600">{[a.city, a.zipCode, countryName(a.country)].filter(Boolean).join(', ')}</p>
                </div>
              </div>
              <button type="button" aria-label={`Delete ${a.addressType} address`} onClick={() => remove(a._id)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
};

/* ---------- Container ---------- */

const ProfileContent = ({ active }: { active: ProfileTab }) => (
  <div className="min-w-0">
    {active === 'profile' && <ProfileTabPanel />}
    {active === 'orders' && <OrdersPanel mode="orders" />}
    {active === 'refunds' && <OrdersPanel mode="refunds" />}
    {active === 'addresses' && <AddressesPanel />}
    {active === 'inbox' && (
      <section className="card overflow-hidden">
        <UserInbox />
      </section>
    )}
  </div>
);

export default ProfileContent;
