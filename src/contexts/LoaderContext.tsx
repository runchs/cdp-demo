import React, { createContext, useState, ReactNode, useContext } from 'react';

interface LoaderContextProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

interface LoaderProviderProps {
    children: ReactNode;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const useLoader = (): LoaderContextProps => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};
