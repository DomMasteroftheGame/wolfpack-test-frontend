import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { handleShopifyAuth, isInShopifyIframe, getShopifyParams } from '../utils/shopifyIntegration';

interface ShopifyAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  shopDomain: string;
  error: string | null;
  login: () => Promise<boolean>;
}

const defaultContextValue: ShopifyAuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  shopDomain: '',
  error: null,
  login: async () => false
};

const ShopifyAuthContext = createContext<ShopifyAuthContextType>(defaultContextValue);

export const useShopifyAuth = () => useContext(ShopifyAuthContext);

interface ShopifyAuthProviderProps {
  children: ReactNode;
}

export const ShopifyAuthProvider: React.FC<ShopifyAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shopDomain, setShopDomain] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const authenticateWithShopify = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const authenticated = await handleShopifyAuth();
      setIsAuthenticated(authenticated);
      
      const params = getShopifyParams();
      if (params.shop) {
        setShopDomain(params.shop);
      }
      
      return authenticated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown authentication error';
      setError(errorMessage);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = getShopifyParams();
    // Authenticate if in iframe OR if we have portal params (email/id)
    if (isInShopifyIframe() || (params.email && params.id)) {
      authenticateWithShopify();
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <ShopifyAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        shopDomain,
        error,
        login: authenticateWithShopify
      }}
    >
      {children}
    </ShopifyAuthContext.Provider>
  );
};

export default ShopifyAuthProvider;
