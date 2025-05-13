// uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IErrorState {
  DB: boolean;         // true = error
  CDP: boolean[];      // ต้องครบ 3 เส้นถึงจะเป็น error (CustSegment, Suggestion, CustProfile)
  SystemI: boolean[];  // ต้องครบ 2 เส้นถึงจะเป็น error (CustInfo, CustProfile)
  Other: boolean;
}

interface IErrorInfo {
  errorMsg: string;
  showInfo: boolean;
  errorState: IErrorState,
}

const initialErrorState: IErrorState = {
  DB: false,
  CDP: [false, false, false],
  SystemI: [false, false],
  Other: false,
};

const initialState: IErrorInfo = {
  errorMsg: '',
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
  setShowInfo, 
  resetShowInfo, 
  setErrorState,
  resetErrorState, 
} = errorInfoSlice.actions;

export default errorInfoSlice.reducer;
