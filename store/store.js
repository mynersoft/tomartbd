import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import voucherReducer from './slices/voucherSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import blogReducer from './slices/blogSlice';
import authReducer from './slices/authSlice';
import statcardReducer from './slices/statCardSlice';
import authRecoveryReducer from './slices/authRecoverySlice';
import notificationReducer from './slices/notificationSlice';
import questionsReducer from './slices/questionsSlice';
import comboReducer from './slices/comboSlice';
import bogoReducer from './slices/bogoSlice';
import vendorReducer from './slices/vendorSlice';
import uiReducer from './slices/uiSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    authRecovery: authRecoveryReducer,
    auth: authReducer,
    ui: uiReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    user: userReducer,
    order: orderReducer,
    voucher: voucherReducer,
    statcard: statcardReducer,
    questions: questionsReducer,
    vendor: vendorReducer,
    notification: notificationReducer,
    blog: blogReducer,
    combo: comboReducer,
    bogo: bogoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
