import axios from 'axios';
import { getEnv } from '@/env';

const { apiUrl } = getEnv();

const baseAPI = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default baseAPI;