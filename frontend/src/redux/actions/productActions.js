import axios from 'axios';
import server from '../../server.js';

export const createProduct = (data) => async (dispatch) => {
  try {
    dispatch({ type: 'productCreateRequest' });
    const res = await axios.post(`${server}product/create-product`, data, {
      withCredentials: true,
    });
    dispatch({ type: 'productCreateSuccess', payload: res.data.product });
  } catch (error) {
    dispatch({
      type: 'productCreateFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({ type: 'getAllProductsRequest' });
    const res = await axios.get(`${server}product/all`);
    dispatch({ type: 'getAllProductsSuccess', payload: res.data.products });
  } catch (error) {
    dispatch({
      type: 'getAllProductsFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getShopProducts = (shopId) => async (dispatch) => {
  try {
    dispatch({ type: 'getShopProductsRequest' });
    const res = await axios.get(`${server}product/shop/${shopId}`);
    dispatch({ type: 'getShopProductsSuccess', payload: res.data.products });
  } catch (error) {
    dispatch({
      type: 'getShopProductsFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'getProductDetailsRequest' });
    const res = await axios.get(`${server}product/${id}`);
    dispatch({ type: 'getProductDetailsSuccess', payload: res.data.product });
  } catch (error) {
    dispatch({
      type: 'getProductDetailsFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateProduct = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: 'productUpdateRequest' });
    const res = await axios.put(`${server}product/${id}`, data, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch({ type: 'productUpdateSuccess', payload: res.data.product });
  } catch (error) {
    dispatch({
      type: 'productUpdateFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: 'productDeleteRequest' });
    await axios.delete(`${server}product/${id}`, { withCredentials: true });
    dispatch({ type: 'productDeleteSuccess', payload: id });
  } catch (error) {
    dispatch({
      type: 'productDeleteFail',
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: 'clearErrors' });
};
