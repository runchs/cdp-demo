import axios from '@axios';
import { useState } from 'react';

export enum CConvertType {
    AeonId = 1,
    CustomrtId
}

export interface IconvertInfo {
    aeonId: string;
    customerId: string;
    traceId: string;
    user?: string;
}

const convertInfo = <IconvertInfo>{
    aeonId: '',
    customerId: '',
    traceId: '',
}

export const convertId = (type: CConvertType, value: string, user?: string) => {
    if (type === CConvertType.AeonId) {
        convertAeonId(value, user);
    } else {
        convertCustomerId(value, user);
    }

    return convertInfo;
}

const convertAeonId = (id: string, user?: string) => {
    // connect api convert aeon id
    axios.get('/convert/aeonid', { params: { aeon_id: id, user: user } })
        .then((response: any) => {
            const resp = response.data;

            convertInfo.aeonId = resp.aeon_id;
            convertInfo.customerId = resp.cust_id;
            convertInfo.traceId = resp.trace_id;
        })
        .catch((error: any) => {
            console.error("เกิดข้อผิดพลาด:", error);
        })
        .finally(() => {

        });
}

const convertCustomerId = (id: string, user?: string) => {
    // connect api convert customer id
    axios.get('/convert/custid', { params: { cust_id: id, user: user } })
        .then((response: any) => {
            const resp = response.data;

            convertInfo.aeonId = resp.aeon_id;
            convertInfo.customerId = resp.cust_id;
            convertInfo.traceId = resp.trace_id;
        })
        .catch((error: any) => {
            console.error("เกิดข้อผิดพลาด:", error);
        })
        .finally(() => {

        });
}
