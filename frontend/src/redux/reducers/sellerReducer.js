import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isSeller: false,
  isLoading: false,
};

const sellerReducer = createReducer(initialState, (builder) => {
  builder.addCase('LoadSellerRequest', (state) => {
    state.isLoading = true;
  });
  builder.addCase('LoadSellerSuccess', (state, action) => {
    state.isSeller = true;
    state.isLoading = false;
    state.seller = action.payload;
  });
  builder.addCase('LoadSellerFail', (state, action) => {
    state.isSeller = false;
    state.isLoading = false;
    state.error = action.payload;
  });
  builder.addCase('clearErrors', (state) => {
    state.error = null;
  });
});

export default sellerReducer;
