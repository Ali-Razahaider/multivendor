export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: 'addToWishlist',
    payload: data,
  })
  localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlist))
}

export const removeFromWishlist = (id) => async (dispatch, getState) => {
  dispatch({
    type: 'removeFromWishlist',
    payload: id,
  })
  localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlist))
}
