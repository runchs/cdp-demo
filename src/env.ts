interface Env {
    appName: string;
    apiUrl: string;
    mode: string;
};

let envCache: Env | null = null;

export const getEnv = (): Env => {
    if (envCache) return envCache;

    const {
        VITE_APP_NAME,
        VITE_API_URL,
        VITE_MODE,
    } = import.meta.env;

    if (!VITE_API_URL) throw new Error('❌ Missing VITE_API_URL');
    if (!VITE_APP_NAME) throw new Error('❌ Missing VITE_APP_NAME');

    envCache = {
        appName: VITE_APP_NAME,
        apiUrl: VITE_API_URL,
        mode: VITE_MODE || 'sit',
    };

    return envCache;
};
