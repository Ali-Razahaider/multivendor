import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import server from '../../server.js';
import { apiError } from '../../lib/api';
import { loadUser } from '../../redux/actions/userActions';
import { loadSeller } from '../../redux/actions/sellerActions';
import PasswordField from './PasswordField';
import { safeRedirect } from './safeRedirect';

// Email/password sign-in shared by shoppers and sellers.
const SignInForm = ({ kind }: { kind: 'user' | 'shop' }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isShop = kind === 'shop';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${server}${isShop ? 'shop' : 'user'}/login`, { email, password }, { withCredentials: true });
      if (isShop) {
        await dispatch(loadSeller() as any);
        toast.success('Welcome back to your shop!');
        navigate(safeRedirect(searchParams.get('redirect'), '/dashboard'), { replace: true });
      } else {
        await dispatch(loadUser() as any);
        toast.success('Welcome back!');
        navigate(safeRedirect(searchParams.get('redirect'), '/'), { replace: true });
      }
    } catch (err) {
      toast.error(apiError(err, 'Sign in failed'));
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate={false}>
      <div>
        <label htmlFor="email" className="field-label">Email address</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
      </div>
      <PasswordField id="password" label="Password" value={password} onChange={setPassword} />
      <div className="flex justify-end">
        <Link to={isShop ? '/forgot-password?type=shop' : '/forgot-password'} className="text-sm font-medium text-brand-700 hover:text-brand-600">
          Forgot password?
        </Link>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
};

export default SignInForm;
