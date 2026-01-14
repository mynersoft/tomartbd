import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchBOGOProducts = createAsyncThunk(
  'bogo/fetchBOGOProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/products?offer=BOGO');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBOGOProduct = createAsyncThunk(
  'bogo/createBOGOProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin/products', productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const applyBOGOToCart = createAsyncThunk(
  'bogo/applyBOGOToCart',
  async ({ cartItems }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cart/apply-bogo', { cartItems });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const bogoSlice = createSlice({
  name: 'bogo',
  initialState: {
    products: [],
    loading: false,
    error: null,
    cartWithBOGO: [],
  },
  reducers: {
    clearBOGOError: (state) => {
      state.error = null;
    },
    clearBOGOCart: (state) => {
      state.cartWithBOGO = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch BOGO Products
      .addCase(fetchBOGOProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBOGOProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchBOGOProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create BOGO Product
      .addCase(createBOGOProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBOGOProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createBOGOProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Apply BOGO to Cart
      .addCase(applyBOGOToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyBOGOToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartWithBOGO = action.payload;
      })
      .addCase(applyBOGOToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBOGOError, clearBOGOCart } = bogoSlice.actions;
export default bogoSlice.reducer;
