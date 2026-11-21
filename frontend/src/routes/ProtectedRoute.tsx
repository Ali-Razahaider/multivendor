import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Loader from '../components/Layout/Loader';

// Sends signed-out visitors to the login page and back here afterwards.
const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state: any) => state.user);
  const location = useLocation();

  if (loading) return <Loader />;
  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
};

export default ProtectedRoute;
