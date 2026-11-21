import { Link } from 'react-router-dom';
import AuthLayout from '../auth/AuthLayout';
import SignInForm from '../auth/SignInForm';

const ShopLogin = () => (
  <AuthLayout
    variant="seller"
    title="Seller sign in"
    subtitle="Manage your products, orders and payouts."
    footer={
      <>
        Don’t have a shop yet?{' '}
        <Link to="/shop-create" className="font-semibold text-brand-700 hover:text-brand-600">Open one for free</Link>
        <span className="mx-2 text-slate-300">·</span>
        <Link to="/login" className="font-medium text-slate-700 hover:text-slate-900">Shopper sign in</Link>
      </>
    }
  >
    <SignInForm kind="shop" />
  </AuthLayout>
);

export default ShopLogin;
