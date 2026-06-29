export const addToWishlist = (item) => ({
  type: 'addToWishlist',
  payload: item,
})

export const removeFromWishlist = (id) => ({
  type: 'removeFromWishlist',
  payload: id,
})
