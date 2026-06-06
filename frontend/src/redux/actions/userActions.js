import axios from 'axios';
import server from '../../server.js';

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: 'LoadUserRequest' });
    const res = await axios.get(`${server}user/current`, {
      withCredentials: true,
    });
    dispatch({ type: 'LoadUserSuccess', payload: res.data.user });
  } catch (error) {
    dispatch({
      type: 'LoadUserFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};
