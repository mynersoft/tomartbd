import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    selectedOrder: null,
    isModalOpen: false,
  },
  reducers: {
    openOrderModal(state, action) {
      state.selectedOrder = action.payload;
      state.isModalOpen = true;
    },
    closeOrderModal(state) {
      state.selectedOrder = null;
      state.isModalOpen = false;
    },
  },
});

export const { openOrderModal, closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;