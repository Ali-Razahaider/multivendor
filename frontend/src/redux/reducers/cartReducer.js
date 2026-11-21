import { createReducer } from '@reduxjs/toolkit';

const MAX_QTY = 20

const isObjectId = (id) => typeof id === 'string' && /^[a-f\d]{24}$/i.test(id)

// Older carts stored whole product objects (and demo items without real ids);
// keep only purchasable items in the current shape.
const normalize = (item) => {
  if (!item || !isObjectId(item._id)) return null
  const images = item.images || item.image_Url
  const image = item.image || (Array.isArray(images) ? images[0]?.url || images[0] : undefined)
  return {
    _id: item._id,
    name: item.name,
    price: Number(item.price) || 0,
    discountedPrice: item.discountedPrice ?? item.discount_price,
    image,
    shopId: item.shopId,
    shopName: item.shopName || item.shop?.name,
    stock: Number(item.stock ?? item.countInStock ?? MAX_QTY),
    qty: Math.max(1, Number(item.qty) || 1),
  }
}

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('cartItems') || '[]')
    return Array.isArray(saved) ? saved.map(normalize).filter(Boolean) : []
  } catch {
    return []
  }
}

const clampQty = (qty, stock) => Math.max(1, Math.min(Number(qty) || 1, stock > 0 ? stock : MAX_QTY, MAX_QTY))

const initialState = {
  cart: loadCart(),
}

const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase('addToCart', (state, action) => {
      const item = normalize(action.payload)
      if (!item) return
      const existing = state.cart.find((i) => i._id === item._id)
      if (existing) {
        Object.assign(existing, { ...item, qty: clampQty(item.qty, item.stock) })
      } else {
        state.cart.push({ ...item, qty: clampQty(item.qty, item.stock) })
      }
    })
    .addCase('updateCartQty', (state, action) => {
      const existing = state.cart.find((i) => i._id === action.payload.id)
      if (existing) existing.qty = clampQty(action.payload.qty, existing.stock)
    })
    .addCase('removeFromCart', (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload)
    })
    .addCase('clearCart', (state) => {
      state.cart = []
    })
})

export default cartReducer
