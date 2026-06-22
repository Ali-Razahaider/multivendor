import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  loading: true,
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase('LoadUserRequest', (state) => {
    state.loading = true;
  });
  builder.addCase('LoadUserSuccess', (state, action) => {
    state.isAuthenticated = true;
    state.loading = false;
    state.user = action.payload;
  });
  builder.addCase('LoadUserFail', (state, action) => {
    state.isAuthenticated = false;
    state.loading = false;
    state.error = action.payload;
  });
  builder.addCase('clearErrors', (state) => {
    state.error = null;
  });
});

export default userReducer;
