import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, isLoading, children }) => {
  if (isLoading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
