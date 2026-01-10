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

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    product: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    user: userReducer,
    order: orderReducer,
    voucher: voucherReducer,
    statcard: statcardReducer,
    questions: questionsReducer,
    notification: notificationReducer,
    blog: blogReducer,
    authRecovery: authRecoveryReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
