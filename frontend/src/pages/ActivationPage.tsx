import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import server from '../server.js';
import { apiError } from '../lib/api';
import { loadUser } from '../redux/actions/userActions';
import { loadSeller } from '../redux/actions/sellerActions';
import AuthLayout from '../components/auth/AuthLayout';

type Status = 'loading' | 'success' | 'error';

function ActivationPage() {
  const { activationToken } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isShop = searchParams.get('type') === 'shop';
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  // StrictMode runs effects twice in development; activate only once.
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !activationToken) return;
    started.current = true;
    axios
      .post(`${server}${isShop ? 'shop' : 'user'}/activation`, { activationToken }, { withCredentials: true })
      .then(() => {
        setStatus('success');
        dispatch((isShop ? loadSeller() : loadUser()) as any);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(apiError(err, 'This activation link is invalid or has expired.'));
      });
  }, [activationToken, isShop, dispatch]);

  const title = status === 'loading' ? 'Activating…' : status === 'success' ? (isShop ? 'Your shop is live!' : 'You’re all set!') : 'Activation failed';

  return (
    <AuthLayout variant={isShop ? 'seller' : 'shopper'} title={title}>
      <div className="text-center" role="status" aria-live="polite">
        {status === 'loading' && (
          <>
            <Loader2 size={40} className="mx-auto animate-spin text-brand-600" aria-hidden="true" />
            <p className="mt-4 text-sm text-slate-600">Confirming your email address…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CircleCheck size={48} className="mx-auto text-emerald-500" aria-hidden="true" />
            <p className="mt-4 text-sm text-slate-600">
              {isShop ? 'Your shop has been activated and you’re signed in. Add your first product to start selling.' : 'Your account is active and you’re signed in.'}
            </p>
            <Link to={isShop ? '/dashboard-create-product' : '/products'} className="btn-primary mt-6 w-full">
              {isShop ? 'Add your first product' : 'Start shopping'}
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <CircleX size={48} className="mx-auto text-rose-500" aria-hidden="true" />
            <p className="mt-4 text-sm text-slate-600">{message}</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Link to={isShop ? '/shop-create' : '/register'} className="btn-primary">Sign up again</Link>
              <Link to={isShop ? '/shop-login' : '/login'} className="btn-secondary">Sign in</Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default ActivationPage;
