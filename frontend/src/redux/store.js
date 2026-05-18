import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
const Store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default Store;
