import { configureStore } from '@reduxjs/toolkit';
import convertInfoReducer from './slices/convertInfoSlice';

export const store = configureStore({
  reducer: {
    convertInfo: convertInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
