import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
import cartReducer from './reducers/cartReducer.js';
import sellerReducer from './reducers/sellerReducer.js';
const Store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    seller: sellerReducer,

  },
});

export default Store;
