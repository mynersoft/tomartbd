// store/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product._id === product._id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.product._id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.product._id !== action.payload);
    },

    incrementQty: (state, action) => {
      const item = state.items.find(i => i.product._id === action.payload);
      if (item) item.quantity += 1;
    },

    decrementQty: (state, action) => {
      const item = state.items.find(i => i.product._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item) {
        state.items = state.items.filter(i => i.product._id !== action.payload);
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartTotal = state =>
  state.cart.items.reduce((total, item) => {
    const price = item.product.discount
      ? (item.product.price * (100 - item.product.discount)) / 100
      : item.product.price;
    return total + price * item.quantity;
  }, 0);

export const { addToCart, removeFromCart, incrementQty, decrementQty,updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;