import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import server from '../../server.js';
import { apiError, passwordIsStrong } from '../../lib/api';
import AuthLayout from '../auth/AuthLayout';
import PasswordField from '../auth/PasswordField';
import CheckEmail from '../auth/CheckEmail';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordIsStrong(password)) {
      toast.error('Please choose a stronger password');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${server}user/register`, { name, email, password });
      setSentMessage(data.message || 'We sent you a link to activate your account.');
    } catch (err) {
      toast.error(apiError(err, 'Sign up failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Bazaarly to shop, save favourites and track orders."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-600">Sign in</Link>
        </>
      }
    >
      {sentMessage ? (
        <CheckEmail email={email} message={sentMessage} onReset={() => setSentMessage('')} />
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="field-label">Full name</label>
            <input id="name" type="text" autoComplete="name" required minLength={2} maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className="field" />
          </div>
          <div>
            <label htmlFor="email" className="field-label">Email address</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
          </div>
          <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" showRules />
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-xs text-slate-500">We’ll email you a link to confirm your address.</p>
        </form>
      )}
    </AuthLayout>
  );
};

export default Register;
