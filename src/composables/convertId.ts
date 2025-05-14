// useConvert.ts
import axios from '@axios';
import { useLoader } from '@/contexts/LoaderContext';
import { useCallback } from 'react';
import { IConvertInfo } from '@/store/slices/convertInfoSlice'

export const useConvertId = () => {
    const { setIsLoading } = useLoader();

    const convertAeonId = useCallback((id: string, isDeeplink: boolean = false, user?: string): Promise<IConvertInfo> => {
        setIsLoading(true);
        return axios.get('/convert/aeonid', { params: { aeon_id: id, user: isDeeplink ? 'deeplink' : user} })
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
                console.error("Error:", error);
                const err = error.response.data.error;
                throw err.code === 'NOT_FOUND' ? err.details.db : err.message;
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setIsLoading]);

    const convertCustomerId = useCallback((id: string, user?: string): Promise<IConvertInfo> => {
        return axios.get('/convert/custid', { params: { cust_id: id, user: user } })
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
