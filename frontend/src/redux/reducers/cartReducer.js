import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  cart: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
}

const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('addToCart', (state, action) => {
      const item = action.payload
      const index = state.cart.findIndex((i) => i._id === item._id)
      if (index !== -1) {
        state.cart[index].qty += item.qty
      } else {
        state.cart.push(item)
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cart))
    })
    .addCase('removeFromCart', (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(state.cart))
    })
    .addCase('clearCart', (state) => {
      state.cart = []
      localStorage.removeItem('cartItems')
    })
})

export default cartReducer
