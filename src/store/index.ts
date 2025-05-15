import { configureStore } from '@reduxjs/toolkit';
import accessInfoReducer from './slices/accessInfoSlice';
import customerInfoReducer from './slices/customerInfoSlice';
import errorInfoReducer from './slices/errorInfoSlice';

export const store = configureStore({
  reducer: {
    accessInfo: accessInfoReducer,
    customerInfo: customerInfoReducer,
    errorInfo: errorInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
