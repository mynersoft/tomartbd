import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";



export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		product: productReducer,
		cart: cartReducer,
		wishlist: wishlistReducer,
order: orderReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});


