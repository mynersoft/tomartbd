import { createSlice } from "@reduxjs/toolkit";

const initialItems =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("cart") || "[]")
    : [];

const initialState = {
  items: initialItems,
  qty: initialItems.reduce((t, i) => t + i.quantity, 0),
};

const saveCart = (items) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const updateQty = (state) => {
  state.qty = state.items.reduce((t, i) => t + i.quantity, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const item = state.items.find((i) => i._id === product._id);

      if (item) item.quantity += quantity;
      else state.items.push({ ...product, quantity });

      updateQty(state);
      saveCart(state.items);
    },

    incrementQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;

      updateQty(state);
      saveCart(state.items);
    },

    decrementQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;

      updateQty(state);
      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      updateQty(state);
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.qty = 0;
      saveCart([]);
    },
  },
});

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;