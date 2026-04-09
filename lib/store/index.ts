import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/slices/authSlice';
import checkReducer from '@/lib/slices/checkSlice';
import adminReducer from '@/lib/slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    check: checkReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
