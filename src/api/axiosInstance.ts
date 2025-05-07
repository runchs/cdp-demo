import axios from 'axios';
import { getEnv } from '@/env';

const baseAPI = axios.create({
    baseURL: getEnv().apiUrl,
    headers: {},
});

export default baseAPI;
