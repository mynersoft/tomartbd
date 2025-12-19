import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

/* ================= SLICE ================= */
const orderSlice = createSlice({
	name: "order",
	initialState: {
		loading: false,
		success: false,
		error: null,
		orders: [],
	},

	reducers: {
		resetOrder(state) {
			state.loading = false;
			state.success = false;
			state.error = null;
		},
		removeOrder: (state, action) => {
			state.orders = state.orders.filter(
				(order) => order._id !== action.payload
			);
		},
		setOrders(state, action) {			
			state.orders = action.payload.orders;
		},
		addOrder(state, action) {
			state.orders.push(action.payload);
		},
	},
	extraReducers: () => {},
});

export const { resetOrder, setOrders, addOrder, removeOrder } =
	orderSlice.actions;
export default orderSlice.reducer;
