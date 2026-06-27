import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
import cartReducer from './reducers/cartReducer.js';
import sellerReducer from './reducers/sellerReducer.js';
import productReducer from './reducers/productReducer.js';
import eventReducer from './reducers/eventReducer.js';
const Store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    seller: sellerReducer,
    product: productReducer,
    events: eventReducer,
  },
});

export default Store;
