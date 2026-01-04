import React, { useState, useEffect } from 'react';
import { 
  runShopifyEnvironmentTests, 
  simulateShopifyEnvironment,
  formatShopifyTestReportAsHtml,
  ShopifyEnvironmentConfig,
  ShopifyTestReport
} from '../utils/shopifyEnvironmentTester';

interface ShopifyEnvironmentTesterProps {
  initialConfig?: Partial<ShopifyEnvironmentConfig>;
}

const ShopifyEnvironmentTester: React.FC<ShopifyEnvironmentTesterProps> = ({ 
  initialConfig = {} 
}) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [report, setReport] = useState<ShopifyTestReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<Partial<ShopifyEnvironmentConfig>>({
    shopDomain: 'buildyourwolfpack.myshopify.com',
    isEmbedded: true,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    ...initialConfig
  });
  
  const handleConfigChange = (key: keyof ShopifyEnvironmentConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSimulate = () => {
    setIsSimulating(true);
    setError(null);
    
    try {
      const cleanup = simulateShopifyEnvironment(config);
      
      (window as any).__SHOPIFY_ENV_CLEANUP__ = cleanup;
      
      setTimeout(() => {
        setIsSimulating(false);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during simulation');
      setIsSimulating(false);
    }
  };
  
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setError(null);
    
    try {
      const testReport = await runShopifyEnvironmentTests(config);
      setReport(testReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during testing');
    } finally {
      setIsRunningTests(false);
    }
  };
  
  useEffect(() => {
    return () => {
      if ((window as any).__SHOPIFY_ENV_CLEANUP__) {
        (window as any).__SHOPIFY_ENV_CLEANUP__();
        delete (window as any).__SHOPIFY_ENV_CLEANUP__;
      }
    };
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Shopify Environment Tester</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="shop-domain" className="block text-sm font-medium text-gray-700 mb-1">
              Shop Domain
            </label>
            <input
              id="shop-domain"
              type="text"
              value={config.shopDomain || ''}
              onChange={(e) => handleConfigChange('shopDomain', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="is-embedded"
              type="checkbox"
              checked={config.isEmbedded || false}
              onChange={(e) => handleConfigChange('isEmbedded', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="is-embedded" className="ml-2 block text-sm text-gray-700">
              Simulate Embedded App
            </label>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Device Type
          </label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                id="device-mobile"
                type="radio"
                name="device-type"
                checked={config.isMobile || false}
                onChange={() => {
                  handleConfigChange('isMobile', true);
                  handleConfigChange('isTablet', false);
                  handleConfigChange('isDesktop', false);
                }}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="device-mobile" className="ml-2 block text-sm text-gray-700">
                Mobile
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="device-tablet"
                type="radio"
                name="device-type"
                checked={config.isTablet || false}
                onChange={() => {
                  handleConfigChange('isMobile', false);
                  handleConfigChange('isTablet', true);
                  handleConfigChange('isDesktop', false);
                }}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="device-tablet" className="ml-2 block text-sm text-gray-700">
                Tablet
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="device-desktop"
                type="radio"
                name="device-type"
                checked={config.isDesktop || false}
                onChange={() => {
                  handleConfigChange('isMobile', false);
                  handleConfigChange('isTablet', false);
                  handleConfigChange('isDesktop', true);
                }}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="device-desktop" className="ml-2 block text-sm text-gray-700">
                Desktop
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`px-4 py-2 rounded-md ${
            isSimulating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {isSimulating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Simulating...
            </span>
          ) : 'Simulate Shopify Environment'}
        </button>
        
        <button
          onClick={handleRunTests}
          disabled={isRunningTests}
          className={`px-4 py-2 rounded-md ${
            isRunningTests
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunningTests ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Tests...
            </span>
          ) : 'Run Tests'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {report && (
        <div 
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: formatShopifyTestReportAsHtml(report) }}
        />
      )}
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-2">Shopify PWA Integration Tips</h3>
        
        <div className="mb-4">
          <h4 className="font-medium text-indigo-700">🚀 Performance Optimization</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
            <li>Lazy-load images and sections</li>
            <li>Compress assets (use shopify/assets minified versions)</li>
            <li>Avoid blocking scripts in &lt;head&gt; (move to end of &lt;body&gt; when possible)</li>
            <li>Use preconnect, dns-prefetch, and preload for speed-up</li>
            <li>Minimize JavaScript bundle size</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-indigo-700">⚙️ Shopify PWA Integration</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
            <li>Add the manifest and service worker through theme assets</li>
            <li>layout/theme.liquid: inject links to manifest.json and register service worker</li>
            <li>Ensure theme doesn't conflict with Shopify's built-in caching</li>
            <li>Handle theme updates gracefully to avoid breaking the PWA offline state</li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-indigo-700">🔒 Security &amp; Compliance</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-700 mt-2">
            <li>Follow Apple and Google Play guidelines</li>
            <li>Ensure the theme doesn't expose sensitive environment variables or tokens</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShopifyEnvironmentTester;
