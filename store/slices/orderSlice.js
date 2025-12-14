import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	orders: [],        // all orders (admin / user)
	myOrders: [],      // logged-in user's orders (optional)
	loading: false,
	error: null,
};

const orderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {
		// ------------------------
		// Set all orders
		// ------------------------
		setOrders(state, action) {
			state.orders = action.payload;
		},

		// ------------------------
		// Set logged-in user's orders
		// ------------------------
		setMyOrders(state, action) {
			state.myOrders = action.payload;
		},

		// ------------------------
		// Add new order
		// ------------------------
		addOrder(state, action) {
			state.orders.unshift(action.payload);
			state.myOrders.unshift(action.payload);
		},

		// ------------------------
		// Update order status
		// ------------------------
		updateOrderStatus(state, action) {
			const { orderId, status } = action.payload;

			const update = (order) => {
				if (order._id === orderId) {
					order.status = status;
				}
			};

			state.orders.forEach(update);
			state.myOrders.forEach(update);
		},

		// ------------------------
		// Remove order
		// ------------------------
		removeOrder(state, action) {
			state.orders = state.orders.filter(
				(order) => order._id !== action.payload
			);
			state.myOrders = state.myOrders.filter(
				(order) => order._id !== action.payload
			);
		},

		// ------------------------
		// Clear all orders (logout)
		// ------------------------
		clearOrders(state) {
			state.orders = [];
			state.myOrders = [];
			state.error = null;
		},
	},
});

export const {
	setOrders,
	setMyOrders,
	addOrder,
	updateOrderStatus,
	removeOrder,
	clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;