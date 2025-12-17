import { createSlice } from "@reduxjs/toolkit";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    selectedBlog: null,
  },
  reducers: {
    setSelectedBlog: (state, action) => {
      state.selectedBlog = action.payload;
    },
  },
});

export const { setSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;