import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isSeller: false,
  sellerLoading: true,
};

const sellerReducer = createReducer(initialState, (builder) => {
  builder.addCase('LoadSellerRequest', (state) => {
    state.sellerLoading = true;
  });
  builder.addCase('LoadSellerSuccess', (state, action) => {
    state.isSeller = true;
    state.sellerLoading = false;
    state.seller = action.payload;
  });
  builder.addCase('LoadSellerFail', (state, action) => {
    state.isSeller = false;
    state.sellerLoading = false;
    state.error = action.payload;
  });
  builder.addCase('clearErrors', (state) => {
    state.error = null;
  });
});

export default sellerReducer;
