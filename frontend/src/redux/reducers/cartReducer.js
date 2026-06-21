import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder.addCase('addToCart', (state, action) => {
    const item = action.payload;
    const existItem = state.cart.find((i) => i._id === item._id);
    if (existItem) {
      return {
        ...state,
        cart: state.cart.map((i) =>
          i._id === existItem._id ? item : i
        ),
      };
    }
    return {
      ...state,
      cart: [...state.cart, item],
    };
  });
  builder.addCase('removeFromCart', (state, action) => {
    return {
      ...state,
      cart: state.cart.filter((i) => i._id !== action.payload._id),
    };
  });
});

export default cartReducer;
