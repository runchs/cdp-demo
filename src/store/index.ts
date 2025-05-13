import { configureStore } from '@reduxjs/toolkit';
import convertInfoReducer from './slices/convertInfoSlice';
import customerInfoReducer from './slices/customerInfoSlice';
import errorInfoReducer from './slices/errorInfoSlice';

export const store = configureStore({
  reducer: {
    convertInfo: convertInfoReducer,
    customerInfo: customerInfoReducer,
    errorInfo: errorInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
