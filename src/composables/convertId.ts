import axios from '@axios';
import { useEffect, useState } from "react";

export enum CConvertType {
    AeonId = 1,
    CustomrtId
}

export interface IConvertResp {
    aeonId: string;
    customerId: string;
    traceId: string;
}

let convertResp = <IConvertResp>{
    aeonId: '',
    customerId: '',
    traceId: ''
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
    axios.get('/convert/aeonid', { params: { aeon_id: 'qlAHWb7BCO4oDkf4qAGi', user: 'test' } })
        .then((response: any) => {
            const resp = response.data;

            convertResp.aeonId = resp.aeon_id;
            convertResp.customerId = resp.cust_id;
            convertResp.traceId = resp.trace_id;
        })
        .catch((error: any) => {
            console.error("เกิดข้อผิดพลาด:", error);
        });
}

const convertCustomerId = (id: string) => {
    // connect api convert customer id
    axios.get('/convert/custid', { params: { cust_id: '1100400132335', user: 'test' } })
        .then((response: any) => {
            const resp = response.data;

            convertResp.aeonId = resp.aeon_id;
            convertResp.customerId = resp.cust_id;
            convertResp.traceId = resp.trace_id;
        })
        .catch((error: any) => {
            console.error("เกิดข้อผิดพลาด:", error);
        });
}
