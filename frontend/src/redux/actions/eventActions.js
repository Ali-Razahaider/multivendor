import axios from 'axios';
import server from '../../server.js';

export const createEvent = (data) => async (dispatch) => {
  try {
    dispatch({ type: 'eventCreateRequest' });
    const res = await axios.post(`${server}event/create-event`, data, {
      withCredentials: true,
    });
    dispatch({ type: 'eventCreateSuccess', payload: res.data.event });
  } catch (error) {
    dispatch({
      type: 'eventCreateFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getShopEvents = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: 'getShopEventsRequest' });
    const res = await axios.get(`${server}event/shop/${shopId}`);
    dispatch({ type: 'getShopEventsSuccess', payload: res.data.events });
  } catch (error) {
    dispatch({
      type: 'getShopEventsFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch({ type: 'getAllEventsRequest' });
    const res = await axios.get(`${server}event/all`);
    dispatch({ type: 'getAllEventsSuccess', payload: res.data.events });
  } catch (error) {
    dispatch({
      type: 'getAllEventsFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'eventDeleteRequest' });
    await axios.delete(`${server}event/${id}`, { withCredentials: true });
    dispatch({ type: 'eventDeleteSuccess', payload: id });
  } catch (error) {
    dispatch({
      type: 'eventDeleteFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: 'clearErrors' });
};
