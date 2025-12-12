import { createSlice } from "@reduxjs/toolkit";

// Load wishlist from localStorage for guests
const initialState = {
	items:
		typeof window !== "undefined"
			? JSON.parse(localStorage.getItem("wishlist") || "[]")
			: [],
};

const saveWishlistToStorage = (wishlist) => {
	if (typeof window !== "undefined") {
		localStorage.setItem("wishlist", JSON.stringify(wishlist));
	}
};

const wishlistSlice = createSlice({
	name: "wishlist",
	initialState,
	reducers: {
		addToWishlist: (state, action) => {
			const product = action.payload;
			const exists = state.items.find((item) => item._id === product._id);

			if (!exists) {
				state.items.push(product);
				saveWishlistToStorage(state.items);
			}
		},
		removeFromWishlist: (state, action) => {
			const productId = action.payload;
			state.items = state.items.filter((item) => item._id !== productId);
			saveWishlistToStorage(state.items);
		},
		toggleWishlist: (state, action) => {
			const product = action.payload;
			const exists = state.items.find((item) => item._id === product._id);

			if (exists) {
				state.items = state.items.filter(
					(item) => item._id !== product._id
				);
			} else {
				state.items.push(product);
			}

			saveWishlistToStorage(state.items);
		},
		clearWishlist: (state) => {
			state.items = [];
			saveWishlistToStorage([]);
		},
		setWishlist: (state, action) => {
			state.items = action.payload;
			saveWishlistToStorage(state.items);
		},
	},
});

export const {
	addToWishlist,
	removeFromWishlist,
	toggleWishlist,
	clearWishlist,
	setWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
