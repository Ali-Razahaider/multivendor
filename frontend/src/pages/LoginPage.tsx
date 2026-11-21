import { useSelector } from 'react-redux';
import { Navigate, useSearchParams } from 'react-router-dom';
import Login from '../components/Login/Login';
import { safeRedirect } from '../components/auth/safeRedirect';

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state: any) => state.user);
  const [searchParams] = useSearchParams();
  if (isAuthenticated) return <Navigate to={safeRedirect(searchParams.get('redirect'))} replace />;
  return <Login />;
};

export default LoginPage;
