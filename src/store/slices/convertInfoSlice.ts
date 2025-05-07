// src/store/slices/convertInfoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IConvertInfo {
    aeonId: string;
    customerId: string;
    traceId: string;
    user?: string;
}

const initialState: IConvertInfo = {
  aeonId: '',
  customerId: '',
  traceId: '',
  user: '',
};

export const convertInfoSlice = createSlice({
  name: 'convertInfo',
  initialState,
  reducers: {
    setConvertInfo: (state: any, action: PayloadAction<IConvertInfo>) => {
      return { ...state, ...action.payload };
    },
    resetConvertInfo: () => initialState,
  },
});

export const { setConvertInfo, resetConvertInfo } = convertInfoSlice.actions;
export default convertInfoSlice.reducer;
