// // // store/slices/cartSlice.js
// // import { createSlice } from "@reduxjs/toolkit";

// // const initialState = {
// // 	items: [],
// // };

// // const cartSlice = createSlice({
// // 	name: "cart",
// // 	initialState,
// // 	reducers: {
// // 		addToCart: (state, action) => {
// // 			const { product, quantity } = action.payload;
// // 			const existingItem = state.items.find(
// // 				(item) => item.product._id === product._id
// // 			);

// // 			if (existingItem) {
// // 				existingItem.quantity += quantity;
// // 			} else {
// // 				state.items.push({ product, quantity });
// // 			}
// // 		},
// // 		updateQuantity: (state, action) => {
// // 			const { productId, quantity } = action.payload;
// // 			const item = state.items.find((i) => i.product._id === productId);
// // 			if (item) {
// // 				item.quantity = quantity;
// // 			}
// // 		},

// // 		removeFromCart: (state, action) => {
// // 			state.items = state.items.filter(
// // 				(item) => item.product._id !== action.payload
// // 			);
// // 		},

// // 		incrementQty: (state, action) => {
// // 			const item = state.items.find(
// // 				(i) => i.product._id === action.payload
// // 			);
// // 			if (item) item.quantity += 1;
// // 		},

// // 		decrementQty: (state, action) => {
// // 			const item = state.items.find(
// // 				(i) => i.product._id === action.payload
// // 			);
// // 			if (item && item.quantity > 1) {
// // 				item.quantity -= 1;
// // 			} else if (item) {
// // 				state.items = state.items.filter(
// // 					(i) => i.product._id !== action.payload
// // 				);
// // 			}
// // 		},

// // 		clearCart: (state) => {
// // 			state.items = [];
// // 		},
// // 	},
// // });

// // // Selectors
// // export const selectCartItems = (state) => state.cart.items;
// // export const selectCartTotal = (state) =>
// // 	state.cart.items.reduce((total, item) => {
// // 		const price = item.product.discount
// // 			? (item.product.price * (100 - item.product.discount)) / 100
// // 			: item.product.price;
// // 		return total + price * item.quantity;
// // 	}, 0);

// // export const {
// // 	addToCart,
// // 	removeFromCart,
// // 	incrementQty,
// // 	decrementQty,
// // 	updateQuantity,
// // 	clearCart,
// // } = cartSlice.actions;
// // export default cartSlice.reducer;

// import { setGuestCart } from "@/hooks/useCart";
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
// 	items: [],
// 	lastUpdated: null,
// 	isLoading: false,
// };

// const cartSlice = createSlice({
// 	name: "cart",
// 	initialState,
// 	reducers: {
// 		addToCart: (state, action) => {
// 			const { product, quantity } = action.payload;
// 			const existingItem = state.items.find(
// 				(item) => item.product._id === product._id
// 			);

// 			if (existingItem) {
// 				existingItem.quantity += quantity;
// 			} else {
// 				state.items.push({ product, quantity });
// 			}
// 			state.lastUpdated = new Date().toISOString();

// 			setGuestCart(state.items);
// 		},

// 		updateQuantity: (state, action) => {
// 			const { productId, quantity } = action.payload;
// 			const item = state.items.find((i) => i.product._id === productId);
// 			if (item) {
// 				item.quantity = Math.max(1, quantity); // Ensure minimum quantity of 1
// 			}
// 			state.lastUpdated = new Date().toISOString();
// 		},

// 		incrementQty: (state, action) => {
// 			const item = state.items.find(
// 				(i) => i.product._id === action.payload
// 			);
// 			if (item) item.quantity += 1;
// 		},

// 		decrementQty: (state, action) => {
// 			const item = state.items.find(
// 				(i) => i.product._id === action.payload
// 			);
// 			if (item && item.quantity > 1) {
// 				item.quantity -= 1;
// 			} else if (item) {
// 				state.items = state.items.filter(
// 					(i) => i.product._id !== action.payload
// 				);
// 			}
// 		},

// 		removeFromCart: (state, action) => {
// 			state.items = state.items.filter(
// 				(item) => item.product._id !== action.payload
// 			);
// 			state.lastUpdated = new Date().toISOString();
// 		},

// 		setCartFromBackend: (state, action) => {
// 			console.log(action.payload);
// 			state.items = action.payload || [];
// 			state.lastUpdated = new Date().toISOString();
// 		},

// 		mergeCarts: (state, action) => {
// 			const backendCart = action.payload;
// 			const mergedItems = [...state.items];

// 			backendCart.forEach((backendItem) => {
// 				const existingIndex = mergedItems.findIndex(
// 					(item) => item.product._id === backendItem.product._id
// 				);

// 				if (existingIndex >= 0) {
// 					// Use the larger quantity
// 					mergedItems[existingIndex].quantity = Math.max(
// 						mergedItems[existingIndex].quantity,
// 						backendItem.quantity
// 					);
// 				} else {
// 					mergedItems.push(backendItem);
// 				}
// 			});

// 			state.items = mergedItems;
// 			state.lastUpdated = new Date().toISOString();
// 		},

// 		clearCart: (state) => {
// 			state.items = [];
// 			state.lastUpdated = new Date().toISOString();
// 		},

// 		setLoading: (state, action) => {
// 			state.isLoading = action.payload;
// 		},
// 	},
// });

// // Selectors
// export const selectCartItems = (state) => state.cart.items;
// export const selectCartTotal = (state) =>
// 	state.cart.items.reduce((total, item) => {
// 		const price = item.product.discount
// 			? (item.product.price * (100 - item.product.discount)) / 100
// 			: item.product.price;
// 		return total + price * item.quantity;
// 	}, 0);

// export const selectCartTotalItems = (state) =>
// 	state.cart.items.reduce((acc, item) => acc + item.quantity, 0);

// export const selectCartItemQuantity = (productId) => (state) =>
// 	state.cart.items.find((item) => item.product._id === productId)?.quantity ||
// 	0;

// export const {
// 	addToCart,
// 	removeFromCart,
// 	updateQuantity,
// 	setCartFromBackend,
// 	mergeCarts,
// 	clearCart,
// 	setLoading,
// 	incrementQty,
// 	decrementQty,
// } = cartSlice.actions;

// export default cartSlice.reducer;

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

		incrementQty: (state, action) => {
			const item = state.items.find(
				(i) => i.product._id === action.payload
			);
			if (item) item.quantity += 1;
		},

		decrementQty: (state, action) => {
			const item = state.items.find(
				(i) => i.product._id === action.payload
			);
			if (item && item.quantity > 1) {
				item.quantity -= 1;
			} else if (item) {
				state.items = state.items.filter(
					(i) => i.product._id !== action.payload
				);
			}
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

export const {
	addToCart,
	removeFromCart,
	incrementQty,
	decrementQty,
	updateQuantity,
	clearCart,
	setCart,
} = cartSlice.actions;

export default cartSlice.reducer;
