import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Register from '../components/Register/Register';

const RegisterPage = () => {
  const { isAuthenticated } = useSelector((state: any) => state.user);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <Register />;
};

export default RegisterPage;
