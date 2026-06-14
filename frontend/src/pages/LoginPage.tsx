import { useSelector } from 'react-redux';
import Login from '../components/Login/Login.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }
    , []);
  
  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
