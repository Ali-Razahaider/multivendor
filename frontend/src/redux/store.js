import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
import cartReducer from './reducers/cartReducer.js';
import wishlistReducer from './reducers/wishlistReducer.js';
import sellerReducer from './reducers/sellerReducer.js';
import productReducer from './reducers/productReducer.js';
import eventReducer from './reducers/eventReducer.js';
import couponReducer from './reducers/couponReducer.js';
import orderReducer from './reducers/orderReducer.js';
const Store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    seller: sellerReducer,
    product: productReducer,
    events: eventReducer,
    coupon: couponReducer,
    order: orderReducer,
  },
});

export default Store;
