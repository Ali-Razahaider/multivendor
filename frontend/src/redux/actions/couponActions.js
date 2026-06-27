import axios from 'axios';
import server from '../../server.js';

export const createCoupon = (data) => async (dispatch) => {
  try {
    dispatch({ type: 'couponCreateRequest' });
    const res = await axios.post(`${server}coupon/create-coupon`, data, {
      withCredentials: true,
    });
    dispatch({ type: 'couponCreateSuccess', payload: res.data.coupon });
  } catch (error) {
    dispatch({
      type: 'couponCreateFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getShopCoupons = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: 'getShopCouponsRequest' });
    const res = await axios.get(`${server}coupon/shop/${shopId}`);
    dispatch({ type: 'getShopCouponsSuccess', payload: res.data.coupons });
  } catch (error) {
    dispatch({
      type: 'getShopCouponsFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'couponDeleteRequest' });
    await axios.delete(`${server}coupon/${id}`, { withCredentials: true });
    dispatch({ type: 'couponDeleteSuccess', payload: id });
  } catch (error) {
    dispatch({
      type: 'couponDeleteFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: 'clearErrors' });
};
