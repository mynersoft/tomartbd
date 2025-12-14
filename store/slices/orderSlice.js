import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const placeOrderCOD = createAsyncThunk(
	"order/placeOrderCOD",
	async (orderData, thunkAPI) => {
		try {
			const res = await axios.post("/api/orders", orderData);
			return res.data;
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

const orderSlice = createSlice({
	name: "order",
	initialState: {
		loading: false,
		success: false,
		error: null,
	},
	reducers: {
		resetOrder: (state) => {
			state.loading = false;
			state.success = false;
			state.error = null;
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

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;