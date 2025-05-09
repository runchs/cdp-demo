import React, { createContext, useState, ReactNode, useContext } from 'react';

interface ILoaderContextProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

interface ILoaderProviderProps {
    children: ReactNode;
}

const LoaderContext = createContext<ILoaderContextProps | undefined>(undefined);

export const useLoader = (): ILoaderContextProps => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};

export const LoaderProvider: React.FC<ILoaderProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};
