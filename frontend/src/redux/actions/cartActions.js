export const addToCart = (item) => ({
  type: 'addToCart',
  payload: item,
})

export const removeFromCart = (id) => ({
  type: 'removeFromCart',
  payload: id,
})

export const clearCart = () => ({
  type: 'clearCart',
})
