import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    coupons: [],
    coupon: null,
    success: false,
    error: null,
};

const couponReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('couponCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('couponCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.coupon = action.payload;
            state.coupons = [...state.coupons, action.payload];
            state.success = true;
        })
        .addCase('couponCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('getShopCouponsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getShopCouponsSuccess', (state, action) => {
            state.isLoading = false;
            state.coupons = action.payload;
        })
        .addCase('getShopCouponsFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase('couponDeleteRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('couponDeleteSuccess', (state, action) => {
            state.isLoading = false;
            state.coupons = state.coupons.filter((c) => c._id !== action.payload);
            state.success = true;
        })
        .addCase('couponDeleteFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('clearErrors', (state) => {
            state.error = null;
            state.success = false;
        });
});

export default couponReducer;
