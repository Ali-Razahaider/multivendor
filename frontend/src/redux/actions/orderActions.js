import axios from 'axios';
import server from '../../server.js';

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: 'createOrderRequest' });
    const { data } = await axios.post(`${server}order/create-order`, order, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch({ type: 'createOrderSuccess', payload: data.orders });
  } catch (error) {
    dispatch({
      type: 'createOrderFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: 'getAllOrdersUserRequest' });
    const { data } = await axios.get(
      `${server}order/get-all-orders/${userId}`,
      { withCredentials: true }
    );
    dispatch({ type: 'getAllOrdersUserSuccess', payload: data.orders });
  } catch (error) {
    dispatch({
      type: 'getAllOrdersUserFailed',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllOrdersOfSeller = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: 'getAllOrdersSellerRequest' });
    const { data } = await axios.get(
      `${server}order/get-seller-all-orders/${shopId}`,
      { withCredentials: true }
    );
    dispatch({ type: 'getAllOrdersSellerSuccess', payload: data.orders });
  } catch (error) {
    dispatch({
      type: 'getAllOrdersSellerFailed',
      payload: error.response?.data?.message || error.message,
    });
  }
};
