import axios from 'axios';
import server from '../../server.js';

export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({ type: 'LoadSellerRequest' });
    const res = await axios.get(`${server}shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({ type: 'LoadSellerSuccess', payload: res.data.shop });
  } catch (error) {
    dispatch({
      type: 'LoadSellerFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};
