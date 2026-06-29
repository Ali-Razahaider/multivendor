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
      const isItemExist = state.wishlist.find((i) => i._id === item._id)
      if (isItemExist) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        )
      } else {
        state.wishlist.push(item)
      }
    })
    .addCase('removeFromWishlist', (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload)
    })
})

export default wishlistReducer
