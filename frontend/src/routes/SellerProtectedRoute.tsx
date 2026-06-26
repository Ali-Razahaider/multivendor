import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Layout/Loader'

const SellerProtectedRoute = ({ children }) => {
    const { sellerLoading, isSeller } = useSelector((state) => state.seller);

    if (sellerLoading) return <Loader />;
    if (!isSeller) {
        return <Navigate to="/shop-login" replace />;
    }
    return children;
}

export default SellerProtectedRoute