
import Register from '../components/Register/Register.tsx'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }
    , []);
  return (
    <div><Register/></div>
  )
}

export default RegisterPage