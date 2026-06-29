export const addToCart = (item) => (dispatch, getState) => {
  dispatch({ type: 'addToCart', payload: item })
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({ type: 'removeFromCart', payload: id })
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart))
}

export const clearCart = () => (dispatch, getState) => {
  dispatch({ type: 'clearCart' })
  localStorage.removeItem('cartItems')
}
