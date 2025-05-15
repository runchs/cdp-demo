// src/store/slices/convertInfoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IConvertInfo {
  aeonId: string;
  customerId: string;
}

export interface IAccessInfo {
  link: string;
  ip: string;
  isDeeplink: boolean;
  user: string;
  traceId: string;
  convertInfo: IConvertInfo;
}

const initialConvertInfo: IConvertInfo = {
  aeonId: '',
  customerId: '',
};

const initialState: IAccessInfo = {
  link: '',
  ip: '',
  isDeeplink: false,
  user: '',
  traceId: '',
  convertInfo: initialConvertInfo,
};

export const convertInfoSlice = createSlice({
  name: 'accessInfo',
  initialState,
  reducers: {
    setAccessInfo: (state, action: PayloadAction<Partial<IAccessInfo>>) => {
      Object.assign(state, action.payload); // ✅ ปรับค่าบน state ตรงๆ
    },
    resetAccessInfo: () => initialState, // ✅ reset ทั้ง state
    setConvertInfo: (state, action: PayloadAction<Partial<IConvertInfo>>) => {
      state.convertInfo = { ...state.convertInfo, ...action.payload };
    },
    resetConvertInfo: (state) => {
      state.convertInfo = initialConvertInfo;
    },
  },
});

export const {
  setAccessInfo,
  resetAccessInfo,
  setConvertInfo,
  resetConvertInfo,
} = convertInfoSlice.actions;

export default convertInfoSlice.reducer;
