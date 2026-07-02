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
    .addCase('getAllOrdersSellerRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('getAllOrdersSellerSuccess', (state, action) => {
      state.isLoading = false;
      state.sellerOrders = action.payload;
    })
    .addCase('getAllOrdersSellerFailed', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase('updateOrderStatusRequest', (state) => {
      state.isLoading = true;
    })
    .addCase('updateOrderStatusSuccess', (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    })
    .addCase('updateOrderStatusFail', (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
    .addCase('clearErrors', (state) => {
      state.error = null;
    })
})

export default orderReducer;
