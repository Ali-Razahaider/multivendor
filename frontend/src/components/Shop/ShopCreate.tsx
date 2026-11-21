import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ImagePlus, Loader2, Store } from 'lucide-react';
import server from '../../server.js';
import { apiError, passwordIsStrong } from '../../lib/api';
import AuthLayout from '../auth/AuthLayout';
import PasswordField from '../auth/PasswordField';
import CheckEmail from '../auth/CheckEmail';

const MAX_LOGO_BYTES = 5 * 1024 * 1024;

const emptyForm = { name: '', email: '', phoneNumber: '', address: '', zipCode: '' };

function ShopCreate() {
  const [form, setForm] = useState(emptyForm);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const update = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return void toast.error('Please choose an image file');
    if (file.size > MAX_LOGO_BYTES) return void toast.error('Logo must be smaller than 5MB');
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordIsStrong(password)) return void toast.error('Please choose a stronger password');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${server}shop/create-shop`, { ...form, password, ...(avatar ? { avatar } : {}) });
      setSentMessage(data.message || 'We sent you a link to activate your shop.');
    } catch (err) {
      toast.error(apiError(err, 'Shop registration failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant="seller"
      wide
      title="Open your shop"
      subtitle="It’s free to start. You’ll confirm your email before going live."
      footer={
        <>
          Already selling?{' '}
          <Link to="/shop-login" className="font-semibold text-brand-700 hover:text-brand-600">Sign in to your shop</Link>
        </>
      }
    >
      {sentMessage ? (
        <CheckEmail email={form.email} message={sentMessage} onReset={() => setSentMessage('')} />
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400 ring-1 ring-slate-200">
              {avatar ? <img src={avatar} alt="Shop logo preview" className="h-full w-full object-cover" /> : <Store size={26} aria-hidden="true" />}
            </span>
            <div>
              <label htmlFor="logo" className="btn-secondary h-9 cursor-pointer px-3 text-xs">
                <ImagePlus size={15} aria-hidden="true" /> {avatar ? 'Change logo' : 'Upload logo'}
              </label>
              <input id="logo" type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              <p className="mt-1 text-xs text-slate-500">Optional · PNG or JPG, up to 5MB</p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="field-label">Shop name</label>
            <input id="name" required maxLength={80} value={form.name} onChange={update('name')} className="field" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="field-label">Email address</label>
              <input id="email" type="email" autoComplete="email" required value={form.email} onChange={update('email')} className="field" />
            </div>
            <div>
              <label htmlFor="phone" className="field-label">Phone number</label>
              <input id="phone" type="tel" autoComplete="tel" required value={form.phoneNumber} onChange={update('phoneNumber')} className="field" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
            <div>
              <label htmlFor="address" className="field-label">Business address</label>
              <input id="address" autoComplete="street-address" required value={form.address} onChange={update('address')} className="field" />
            </div>
            <div>
              <label htmlFor="zip" className="field-label">ZIP / postal code</label>
              <input id="zip" autoComplete="postal-code" required value={form.zipCode} onChange={update('zipCode')} className="field" />
            </div>
          </div>
          <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" showRules />

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {submitting ? 'Creating shop…' : 'Create shop'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ShopCreate;
