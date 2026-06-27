import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    products: [],
    product: null,
    success: false,
    error: null,
};

const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('productCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('productCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.product = action.payload;
            state.products = [...state.products, action.payload];
            state.success = true;
        })
        .addCase('productCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('getAllProductsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllProductsSuccess', (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
        })
        .addCase('getAllProductsFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase('getShopProductsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getShopProductsSuccess', (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
        })
        .addCase('getShopProductsFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase('getProductDetailsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getProductDetailsSuccess', (state, action) => {
            state.isLoading = false;
            state.product = action.payload;
        })
        .addCase('getProductDetailsFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase('productUpdateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('productUpdateSuccess', (state, action) => {
            state.isLoading = false;
            state.product = action.payload;
            state.products = state.products.map((p) =>
                p._id === action.payload._id ? action.payload : p
            );
            state.success = true;
        })
        .addCase('productUpdateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('productDeleteRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('productDeleteSuccess', (state, action) => {
            state.isLoading = false;
            state.products = state.products.filter((p) => p._id !== action.payload);
            state.success = true;
        })
        .addCase('productDeleteFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('clearErrors', (state) => {
            state.error = null;
            state.success = false;
        });
});

export default productReducer;
