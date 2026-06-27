import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
import cartReducer from './reducers/cartReducer.js';
import sellerReducer from './reducers/sellerReducer.js';
import productReducer from './reducers/productReducer.js';
const Store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    seller: sellerReducer,
    product: productReducer,
  },
});

export default Store;
