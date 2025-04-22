export enum CConvertType {
    AeonId = 1,
    CustomrtId
}

export interface IConvertResp {
    aeonId: string;
    customerId: string;
}

let convertResp = <IConvertResp>{
    aeonId: '',
    customerId: ''
}

export const convertId = (type: CConvertType, value: string) => {
    if (type === CConvertType.AeonId) {
        convertAeonId(value);
    } else {
        convertCustomerId(value);
    }

    return convertResp;
}

const convertAeonId = (id: string) => {
    // connect api convert aeon id
    convertResp.aeonId = 'Ab1234';
    convertResp.customerId = 'Cd5678';
}

const convertCustomerId = (id: string) => {
    // connect api convert customer id
    convertResp.aeonId = 'Wx1234';
    convertResp.customerId = 'Yz5678';
}
