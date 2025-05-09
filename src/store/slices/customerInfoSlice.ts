import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum COfferResult {
    Acknowledged = 'Acknowledged',
    Interested = 'Interested',
    NotInterested = 'Not Interested',
}

export interface IPromotion {
    code: string;
    name: string;
    detail: string;
    action: string;
    resultTimestamp: string;
    period: string;
    eligibleCard: string[];
    offerResult: COfferResult | null;
}


export interface ICustomerInfo {
    updateDate: string;
    // card 1
    nameTH: string;
    nameEN: string;
    nationalID: string;
    sweetheart: string;
    complaintLevel: string;
    // card 2
    customerGroup: string;
    complaintGroup: string;
    customerType: string;
    memberStatus: string;
    customerSegment: string;
    // card 3
    mobileNo: string;
    mobileNoDesc: string;
    mailTo: string;
    address: string;
    gender: string;
    MaritalStatus: string;
    typeOfJob: string;
    // card 4
    statementChannel: string;
    lastStatementSentDate: string;
    statementSentStatus: string;
    // card 5
    lastIncreaseLimit: string;
    lastReduceLimit: string;
    lastIncome: string;
    lastCardApply: string;
    // card 6
    consentForCollect: string;
    consentForDisclose: string;
    blockedMedia: string;
    // card 7
    suggestAction: string;
    // card 8
    paymentStatus: string;
    dayPastDue: string;
    lastOverDueDate: string;
    // card 9
    suggestCards: string[];
    // card 10
    suggestPromotions: IPromotion[]
}

const initialState: ICustomerInfo = {
    updateDate: '',
    // card 1
    nameTH: '',
    nameEN: '',
    nationalID: '',
    sweetheart: '',
    complaintLevel: '',
    // card 2
    customerGroup: '',
    complaintGroup: '',
    customerType: '',
    memberStatus: '',
    customerSegment: '',
    // card 3
    mobileNo: '',
    mobileNoDesc: '',
    mailTo: '',
    address: '',
    gender: '',
    MaritalStatus: '',
    typeOfJob: '',
    // card 4
    statementChannel: '',
    lastStatementSentDate: '',
    statementSentStatus: '',
    // card 5
    lastIncreaseLimit: '',
    lastReduceLimit: '',
    lastIncome: '',
    lastCardApply: '',
    // card 6
    consentForCollect: '',
    consentForDisclose: '',
    blockedMedia: '',
    // card 7
    suggestAction: '',
    // card 8
    paymentStatus: '',
    dayPastDue: '',
    lastOverDueDate: '',
    // card 9
    suggestCards: [],
    // card 10
    suggestPromotions: []
};

export const customerInfoSlice = createSlice({
  name: 'customerInfo',
  initialState,
  reducers: {
    setCustomerInfo: (state: any, action: PayloadAction<Partial<ICustomerInfo>>) => {
        Object.assign(state, action.payload);
    },
    resetCustomerInfo: () => initialState,
  },
});

export const { setCustomerInfo, resetCustomerInfo } = customerInfoSlice.actions;
export default customerInfoSlice.reducer;
