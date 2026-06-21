import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
import cartReducer from './reducers/cartReducer.js';
const Store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

export default Store;
