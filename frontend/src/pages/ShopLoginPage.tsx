import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ShopLogin from '../components/Shop/ShopLogin';

const ShopLoginPage = () => {
  const { isSeller, sellerLoading } = useSelector((state: any) => state.seller);
  if (!sellerLoading && isSeller) return <Navigate to="/dashboard" replace />;
  return <ShopLogin />;
};

export default ShopLoginPage;
