import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

/* ================= THUNK ================= */
export const placeOrderCOD = createAsyncThunk(
	"order/placeCOD",
	async (orderData, { rejectWithValue }) => {
		try {
			const res = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(orderData),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message);
			}

			return data;
		} catch (error) {
			toast.error(error.message);
			return rejectWithValue(error.message);
		}
	}
);

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
			// Remove order by id
			state.orders = state.orders.filter(
				(order) => order._id !== action.payload
			);
		},
		setOrders(state, action) {
			state.orders = action.payload;
		},
		addOrder(state, action) {
			state.orders.push(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(placeOrderCOD.pending, (state) => {
				state.loading = true;
			})
			.addCase(placeOrderCOD.fulfilled, (state) => {
				state.loading = false;
				state.success = true;
			})
			.addCase(placeOrderCOD.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { resetOrder, setOrders, addOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
