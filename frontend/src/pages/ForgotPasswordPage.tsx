import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import server from '../server.js';
import { apiError } from '../lib/api';
import AuthLayout from '../components/auth/AuthLayout';
import CheckEmail from '../components/auth/CheckEmail';

const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const isShop = searchParams.get('type') === 'shop';
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${server}${isShop ? 'shop' : 'user'}/forgot-password`, { email });
      setSentMessage(data.message);
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant={isShop ? 'seller' : 'shopper'}
      title="Reset your password"
      subtitle={`Enter the email you use for your ${isShop ? 'shop' : 'account'} and we’ll send you a reset link.`}
      footer={
        <Link to={isShop ? '/shop-login' : '/login'} className="font-semibold text-brand-700 hover:text-brand-600">
          Back to sign in
        </Link>
      }
    >
      {sentMessage ? (
        <CheckEmail email={email} message={sentMessage} onReset={() => setSentMessage('')} />
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="field-label">Email address</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
