import { createReducer } from '@reduxjs/toolkit';

let savedWishlist = []
try {
  const raw = localStorage.getItem('wishlistItems')
  if (raw) {
    savedWishlist = JSON.parse(raw)
    savedWishlist = savedWishlist.map((item) => ({
      ...item,
      _id: item._id || item.id,
    }))
  }
} catch (e) {
  localStorage.removeItem('wishlistItems')
}

const initialState = {
  wishlist: savedWishlist,
}

const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('addToWishlist', (state, action) => {
      const item = action.payload
      const exists = state.wishlist.find((i) => i._id === item._id)
      if (!exists) {
        state.wishlist.push(item)
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist))
    })
    .addCase('removeFromWishlist', (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload)
      localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist))
    })
})

export default wishlistReducer
