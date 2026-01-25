import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

/* ================= SLICE ================= */
const brandSlice = createSlice({
  name: 'brand',
  initialState: {
    loading: false,
    success: false,
    error: null,
    brands: [],
    brand: {},
  },

  reducers: {
    resetBrand(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    removeBrand: (state, action) => {
      state.brands = state.brands.filter(
        (brand) => brand._id !== action.payload
      );
    },
    setBrands(state, action) {
      state.brands = action.payload.brands;
    },
    addBrand(state, action) {
      state.brands = [...state.brands, action.payload.brand];
    },
  },
  extraReducers: () => {},
});

export const { resetBrand, setBrands, setSingleBrand, addBrand, removeBrand } =
  brandSlice.actions;
export default brandSlice.reducer;
