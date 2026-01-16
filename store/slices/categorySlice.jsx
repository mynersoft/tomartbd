import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action) => {
      state.categories = state.categories.map((cat) =>
        cat._id === action.payload._id ? action.payload : cat
      );
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (cat) => cat._id !== action.payload
      );
    },
  },
});

export const { setCategories, addCategory, updateCategory, removeCategory } =
  categorySlice.actions;

export default categorySlice.reducer;