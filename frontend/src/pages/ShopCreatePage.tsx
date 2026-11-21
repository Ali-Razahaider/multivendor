import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import ShopCreate from '../components/Shop/ShopCreate';

const ShopCreatePage = () => {
  const { isSeller, sellerLoading } = useSelector((state: any) => state.seller);
  if (!sellerLoading && isSeller) return <Navigate to="/dashboard" replace />;
  return <ShopCreate />;
};

export default ShopCreatePage;
