import { createReducer } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    events: [],
    event: null,
    success: false,
    error: null,
};

const eventReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('eventCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('eventCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.event = action.payload;
            state.events = [...state.events, action.payload];
            state.success = true;
        })
        .addCase('eventCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('getAllEventsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllEventsSuccess', (state, action) => {
            state.isLoading = false;
            state.allEvents = action.payload;
        })
        .addCase('getAllEventsFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase('getShopEventsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getShopEventsSuccess', (state, action) => {
            state.isLoading = false;
            state.events = action.payload;
        })
        .addCase('getShopEventsFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase('eventDeleteRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('eventDeleteSuccess', (state, action) => {
            state.isLoading = false;
            state.events = state.events.filter((e) => e._id !== action.payload);
            state.success = true;
        })
        .addCase('eventDeleteFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })

        .addCase('clearErrors', (state) => {
            state.error = null;
            state.success = false;
        });
});

export default eventReducer;
