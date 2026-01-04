import React, { useEffect, useState } from 'react';
import { 
  initShopifyIntegration, 
  isInShopifyIframe, 
  resizeShopifyIframe,
  handleShopifyAuth
} from '../utils/shopifyIntegration';

interface ShopifyWrapperProps {
  children: React.ReactNode;
}

const ShopifyWrapper: React.FC<ShopifyWrapperProps> = ({ children }) => {
  const [isShopify, setIsShopify] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const shopifyEnvironment = isInShopifyIframe();
    setIsShopify(shopifyEnvironment);
    
    if (shopifyEnvironment) {
      initShopifyIntegration();
      
      handleShopifyAuth()
        .then(authenticated => {
          setIsAuthenticated(authenticated);
          setIsLoading(false);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setIsLoading(false);
        });
      
      const resizeObserver = new ResizeObserver(() => {
        resizeShopifyIframe();
      });
      
      resizeObserver.observe(document.body);
      
      return () => {
        resizeObserver.disconnect();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (isShopify && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-4">
            Please make sure you have the proper permissions to access this app.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isShopify) {
    return (
      <div className="shopify-app-container">
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

export default ShopifyWrapper;
