import axios from 'axios';

const baseAPI = axios.create({
    baseURL: 'https://9a3b9f22-1749-42b7-b3d3-8bf03f6901d7.mock.pstmn.io',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default baseAPI;