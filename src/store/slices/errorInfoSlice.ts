// uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IErrorState {
  AccessLog: boolean;  // true = error    
  DB: boolean;         
  CDP: boolean[];      // ต้อง true ครบ 3 เส้นถึงจะเป็น error (CustSegment, Suggestion, CustProfile)
  SystemI: boolean[];  // ต้อง true ครบ 2 เส้นถึงจะเป็น error (CustInfo, CustProfile)
  Other: boolean;
}

interface IErrorInfo {
  errorMsg: string;
  errorOfferResultMsg: string;
  showInfo: boolean;
  errorState: IErrorState,  
}

const initialErrorState: IErrorState = {
  AccessLog: false,
  DB: false,
  CDP: [false, false, false],
  SystemI: [false, false],
  Other: false,
};

const initialState: IErrorInfo = {
  errorMsg: '',
  errorOfferResultMsg: '',
  showInfo: true,
  errorState: initialErrorState,
};

export const errorInfoSlice = createSlice({
  name: 'errorInfo',
  initialState,
  reducers: {
    setErrorMsg: (state, action: PayloadAction<string>) => {
      state.errorMsg = action.payload;
    },
    clearErrorMsg: (state) => {
      state.errorMsg = '';
    },
    setErrorOfferResultMsg: (state, action: PayloadAction<string>) => {
      state.errorOfferResultMsg = action.payload;
    },
    clearErrorOfferResultMsg: (state) => {
      state.errorOfferResultMsg = '';
    },
    setShowInfo: (state, action: PayloadAction<boolean>) => {
      state.showInfo = action.payload;
    },
    resetShowInfo: (state) => {
      state.showInfo = true;
    },
    setErrorState: (state, action: PayloadAction<Partial<IErrorState>>) => {
      Object.assign(state.errorState, action.payload);
    },
    resetErrorState: (state) => {
      state.errorState = initialErrorState;
    },
  },
});

export const { 
  setErrorMsg, 
  clearErrorMsg, 
  setErrorOfferResultMsg,
  clearErrorOfferResultMsg,
  setShowInfo, 
  resetShowInfo, 
  setErrorState,
  resetErrorState, 
} = errorInfoSlice.actions;

export default errorInfoSlice.reducer;
