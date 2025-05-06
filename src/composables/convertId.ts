// useConvert.ts
import axios from '@axios';
import { useLoader } from '@/contexts/LoaderContext';
import { useCallback } from 'react';

export interface IconvertInfo {
    aeonId: string;
    customerId: string;
    traceId: string;
    user?: string;
}

export const useConvertId = () => {
    const { setIsLoading } = useLoader();

    const convertAeonId = useCallback((id: string, user?: string): Promise<IconvertInfo> => {
        setIsLoading(true);
        return axios.get('/convert/aeonid', { params: { aeon_id: id, user } })
            .then((response: any) => {
                const resp = response.data;
                return {
                    aeonId: resp.aeon_id,
                    customerId: resp.cust_id,
                    traceId: resp.trace_id,
                    user
                };
            })
            .catch((error: any) => {
                const err = error.response.data.error;
                throw err.code === 'NOT_FOUND' ? err.details.db : err.message;
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setIsLoading]);

    const convertCustomerId = useCallback((id: string, user?: string): Promise<IconvertInfo> => {
        return axios.get('/convert/custid', { params: { cust_id: id, user } })
            .then((response: any) => {
                const resp = response.data;
                return {
                    aeonId: resp.aeon_id,
                    customerId: resp.cust_id,
                    traceId: resp.trace_id,
                    user
                };
            })
            .catch((error: any) => {
                const err = error.response.data.error;
                throw err.code === 'NOT_FOUND' ? err.details.db : err.message;
            });
    }, []);

    return {
        convertAeonId,
        convertCustomerId
    };
};
