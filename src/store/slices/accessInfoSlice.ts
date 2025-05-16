// src/store/slices/convertInfoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IPayloadInfo {
  link: string;
  ip: string;
  isDeeplink: boolean;
  user: string;
}

export interface IConvertInfo {
  aeonId: string;
  customerId: string;
}

export interface IAccessInfo {
  payloadInfo: IPayloadInfo;
  traceId: string;
  convertInfo: IConvertInfo;
}

const initialPayloadInfo: IPayloadInfo = {
  link: '',
  ip: '',
  isDeeplink: false,
  user: '',
};

const initialConvertInfo: IConvertInfo = {
  aeonId: '',
  customerId: '',
};

const initialState: IAccessInfo = { 
  payloadInfo: initialPayloadInfo,
  traceId: '',
  convertInfo: initialConvertInfo,
};

export const convertInfoSlice = createSlice({
  name: 'accessInfo',
  initialState,
  reducers: {
    setPayloadInfo: (state, action: PayloadAction<Partial<IPayloadInfo>>) => {
      state.payloadInfo = {
        ...state.payloadInfo,
        ...action.payload,
      };
    },
    resetPayloadInfo: (state) => {
      state.payloadInfo = initialPayloadInfo;
    },
  
    
    setTraceId: (state, action: PayloadAction<string>) => {
      state.traceId = action.payload;
    },
    resetTraceId: (state) => {
      state.traceId = '';
    },
  
    
    setConvertInfo: (state, action: PayloadAction<Partial<IConvertInfo>>) => {
      state.convertInfo = {
        ...state.convertInfo,
        ...action.payload,
      };
    },  
    resetConvertInfo: (state) => {
      state.convertInfo = initialConvertInfo;
    },
  },
});

export const {
  setPayloadInfo,
  resetPayloadInfo,
  setTraceId,
  resetTraceId,
  setConvertInfo,
  resetConvertInfo,
} = convertInfoSlice.actions;

export default convertInfoSlice.reducer;
