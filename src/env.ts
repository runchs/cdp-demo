interface Env {
    apiUrl: string;
    mode: string;
};

export const getEnv = (): Env => {
    const {
        VITE_API_URL,
        VITE_MODE,
    } = import.meta.env;

    if (!VITE_API_URL) throw new Error('❌ Missing VITE_API_URL');

    return {
        apiUrl: VITE_API_URL,
        mode: VITE_MODE || 'sit',
    };
};