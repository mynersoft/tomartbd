import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage (for guests)
const initialItems =
	typeof window !== "undefined"
		? JSON.parse(localStorage.getItem("cart") || "[]")
		: [];

const initialState = {
	items: initialItems,
	qty: initialItems.reduce((total, item) => total + item.quantity, 0),
};

const saveCartToStorage = (cart) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("cart", JSON.stringify(cart));
	}
};

const updateQty = (state) => {
	state.qty = state.items.reduce((total, item) => total + item.quantity, 0);
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, action) => {
			const { product, quantity = 1 } = action.payload;

			const existing = state.items.find(
				(item) => item._id === product._id
			);

			if (existing) {
				existing.quantity += quantity;
			} else {
				state.items.push({ ...product, quantity });
			}

			updateQty(state);
			saveCartToStorage(state.items);
		},

		removeFromCart: (state, action) => {
			
			const productId = action.payload;
			state.items = state.items.filter((item) => item._id !== productId);
			updateQty(state);
			saveCartToStorage(state.items);
		},

		updateQuantity: (state, action) => {
			const { productId, quantity } = action.payload;
			const item = state.items.find((item) => item._id === productId);
			if (item) item.quantity = quantity;
			updateQty(state);
			saveCartToStorage(state.items);
		},

		clearCart: (state) => {
			state.items = [];
			updateQty(state);
			saveCartToStorage([]);
		},

		setCart: (state, action) => {
			state.items = action.payload;
			updateQty(state);
			saveCartToStorage(state.items);
		},
	},
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } =
	cartSlice.actions;

export default cartSlice.reducer;
