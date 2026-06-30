import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
}

const orderReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('createOrderRequest', (state) => {
      state.loading = true;
    })
    .addCase('createOrderSuccess', (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase('createOrderFail', (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase('getAllOrdersUserRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllOrdersUserSuccess', (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase('getAllOrdersUserFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase('clearErrors', (state) => {
      state.error = null;
    })
})

export default orderReducer;
