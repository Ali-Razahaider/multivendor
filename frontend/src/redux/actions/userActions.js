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

export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch({ type: 'UpdateProfileRequest' });
    const res = await axios.put(`${server}user/update-profile`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch({ type: 'UpdateProfileSuccess', payload: res.data.user });
  } catch (error) {
    dispatch({
      type: 'UpdateProfileFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};
