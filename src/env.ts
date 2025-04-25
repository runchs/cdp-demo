interface Env {
    appName: string;
    apiUrl: string;
    mode: string;
};

export const getEnv = (): Env => {
    const {
        VITE_APP_NAME,
        VITE_API_URL,
        VITE_MODE,
    } = import.meta.env;

    if (!VITE_API_URL) throw new Error('❌ Missing VITE_API_URL');
    if (!VITE_APP_NAME) throw new Error('❌ Missing VITE_APP_NAME');

    return {
        appName: VITE_APP_NAME,
        apiUrl: VITE_API_URL,
        mode: VITE_MODE || 'sit',
    };
};