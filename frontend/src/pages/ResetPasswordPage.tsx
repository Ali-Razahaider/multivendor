import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import server from '../server.js';
import { apiError, passwordIsStrong } from '../lib/api';
import { loadUser } from '../redux/actions/userActions';
import { loadSeller } from '../redux/actions/sellerActions';
import AuthLayout from '../components/auth/AuthLayout';
import PasswordField from '../components/auth/PasswordField';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const isShop = searchParams.get('type') === 'shop';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordIsStrong(password)) return void toast.error('Please choose a stronger password');
    if (password !== confirm) return void toast.error('Passwords don’t match');
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${server}${isShop ? 'shop' : 'user'}/reset-password/${token}`, { password }, { withCredentials: true });
      await dispatch((isShop ? loadSeller() : loadUser()) as any);
      toast.success(data.message || 'Password updated');
      navigate(isShop ? '/dashboard' : '/', { replace: true });
    } catch (err) {
      toast.error(apiError(err, 'This reset link is invalid or has expired'));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      variant={isShop ? 'seller' : 'shopper'}
      title="Choose a new password"
      subtitle="Make it something you haven’t used here before."
      footer={
        <Link to={isShop ? '/forgot-password?type=shop' : '/forgot-password'} className="font-semibold text-brand-700 hover:text-brand-600">
          Request a new link
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <PasswordField id="password" label="New password" value={password} onChange={setPassword} autoComplete="new-password" showRules />
        <div>
          <PasswordField id="confirm" label="Confirm new password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
          {mismatch && <p className="mt-1.5 text-xs text-rose-600">Passwords don’t match</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {submitting ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
