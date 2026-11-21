import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import SignInForm from '../auth/SignInForm';

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  return (
    <AuthLayout
      title="Welcome back"
      subtitle={redirect?.startsWith('/checkout') ? 'Sign in to finish checking out.' : 'Sign in to your Bazaarly account.'}
      footer={
        <>
          New to Bazaarly?{' '}
          <Link to={redirect ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'} className="font-semibold text-brand-700 hover:text-brand-600">
            Create an account
          </Link>
          <span className="mx-2 text-slate-300">·</span>
          <Link to="/shop-login" className="font-medium text-slate-700 hover:text-slate-900">Seller sign in</Link>
        </>
      }
    >
      <SignInForm kind="user" />
    </AuthLayout>
  );
};

export default Login;
