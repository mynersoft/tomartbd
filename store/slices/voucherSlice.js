import { createSlice } from "@reduxjs/toolkit";

/* ================= INITIAL STATE ================= */
const initialState = {
	vouchers: [],
	loading: false,
	success: false,
	error: null,
};

/* ================= SLICE ================= */
const voucherSlice = createSlice({
	name: "voucher",
	initialState,

	reducers: {
		/* SET ALL VOUCHERS */
		setVouchers(state, action) {
			state.vouchers = Array.isArray(action.payload)
				? action.payload
				: action.payload?.vouchers || [];
			state.loading = false;
			state.error = null;
		},

		/* ADD NEW VOUCHER */
		addVoucher(state, action) {
			const exists = state.vouchers.find(
				(v) => v.code === action.payload.code
			);

			if (!exists) {
				state.vouchers.unshift(action.payload);
			}
		},

		/* UPDATE VOUCHER */
		updateVoucher(state, action) {
			const index = state.vouchers.findIndex(
				(v) => v._id === action.payload._id
			);

			if (index !== -1) {
				state.vouchers[index] = action.payload;
			}
		},

		/* DELETE VOUCHER */
		deleteVoucher(state, action) {
			state.vouchers = state.vouchers.filter(
				(v) => v._id !== action.payload
			);
		},

		/* REQUEST STATES */
		voucherRequest(state) {
			state.loading = true;
			state.error = null;
		},

		voucherSuccess(state) {
			state.loading = false;
			state.success = true;
		},

		voucherFail(state, action) {
			state.loading = false;
			state.error = action.payload;
		},

		/* RESET */
		resetVoucherState(state) {
			state.loading = false;
			state.success = false;
			state.error = null;
		},
	},
});

export const {
	setVouchers,
	addVoucher,
	updateVoucher,
	deleteVoucher,
	voucherRequest,
	voucherSuccess,
	voucherFail,
	resetVoucherState,
} = voucherSlice.actions;

export default voucherSlice.reducer;
