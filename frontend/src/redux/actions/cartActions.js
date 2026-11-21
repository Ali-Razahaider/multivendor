const persist = (getState) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart))
  } catch {
    // Storage can be unavailable (private mode); the cart still works in memory.
  }
}

export const addToCart = (item) => (dispatch, getState) => {
  dispatch({ type: 'addToCart', payload: item })
  persist(getState)
}

export const updateCartQty = (id, qty) => (dispatch, getState) => {
  dispatch({ type: 'updateCartQty', payload: { id, qty } })
  persist(getState)
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({ type: 'removeFromCart', payload: id })
  persist(getState)
}

export const clearCart = () => (dispatch) => {
  dispatch({ type: 'clearCart' })
  try {
    localStorage.removeItem('cartItems')
  } catch {
    // ignore
  }
}
