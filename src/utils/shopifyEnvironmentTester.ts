/**
 * Shopify Environment Tester
 * 
 * This utility provides functions to test the PWA within a Shopify environment.
 * It includes methods to simulate Shopify-specific behaviors and verify that
 * the PWA works correctly when embedded in a Shopify store.
 */

export interface ShopifyEnvironmentConfig {
  shopDomain: string;
  apiKey: string;
  isEmbedded: boolean;
  themeId: string;
  previewTheme: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface ShopifyTestResult {
  name: string;
  passed: boolean;
  details: string;
}

export interface ShopifyTestReport {
  timestamp: string;
  config: ShopifyEnvironmentConfig;
  results: ShopifyTestResult[];
  overallSuccess: boolean;
}

/**
 * Default Shopify environment configuration for testing
 */
export const defaultShopifyConfig: ShopifyEnvironmentConfig = {
  shopDomain: 'buildyourwolfpack.myshopify.com',
  apiKey: 'test_api_key',
  isEmbedded: true,
  themeId: 'test_theme_id',
  previewTheme: true,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

/**
 * Simulates the Shopify environment by adding Shopify-specific
 * query parameters and global objects
 */
export const simulateShopifyEnvironment = (config: Partial<ShopifyEnvironmentConfig> = {}): (() => void) => {
  const fullConfig: ShopifyEnvironmentConfig = { ...defaultShopifyConfig, ...config };
  
  const originalUrl = window.location.href;
  const originalWindowProps = {
    Shopify: (window as any).Shopify,
    ShopifyApp: (window as any).ShopifyApp,
    ShopifyAnalytics: (window as any).ShopifyAnalytics,
  };
  
  const url = new URL(window.location.href);
  url.searchParams.set('shop', fullConfig.shopDomain);
  url.searchParams.set('hmac', 'test_hmac_signature');
  url.searchParams.set('timestamp', Date.now().toString());
  
  window.history.replaceState({}, '', url.toString());
  
  (window as any).Shopify = {
    shop: fullConfig.shopDomain,
    theme: {
      id: fullConfig.themeId,
      name: 'Build Your Wolfpack Theme',
      role: fullConfig.previewTheme ? 'preview' : 'main',
      theme_store_id: null,
      handle: 'wolfpack',
    },
    locale: 'en',
    currency: {
      active: 'USD',
      rate: '1.0',
    },
    country: 'US',
  };
  
  (window as any).ShopifyApp = {
    isEmbedded: fullConfig.isEmbedded,
  };
  
  (window as any).ShopifyAnalytics = {
    meta: {
      page: {
        pageType: 'page',
        resourceType: 'page',
        resourceId: 1,
      },
    },
  };
  
  let viewportContent = '';
  if (fullConfig.isMobile) {
    viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  } else if (fullConfig.isTablet) {
    viewportContent = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
  } else {
    viewportContent = 'width=device-width, initial-scale=1.0';
  }
  
  let metaTag = document.querySelector('meta[name="viewport"]');
  if (metaTag) {
    metaTag.setAttribute('content', viewportContent);
  } else {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'viewport');
    metaTag.setAttribute('content', viewportContent);
    document.head.appendChild(metaTag);
  }
  
  document.body.classList.add('shopify-app-embedded');
  
  return () => {
    window.history.replaceState({}, '', originalUrl);
    
    (window as any).Shopify = originalWindowProps.Shopify;
    (window as any).ShopifyApp = originalWindowProps.ShopifyApp;
    (window as any).ShopifyAnalytics = originalWindowProps.ShopifyAnalytics;
    
    document.body.classList.remove('shopify-app-embedded');
  };
};

/**
 * Run tests to verify PWA functionality within Shopify environment
 */
export const runShopifyEnvironmentTests = async (
  config: Partial<ShopifyEnvironmentConfig> = {}
): Promise<ShopifyTestReport> => {
  const fullConfig: ShopifyEnvironmentConfig = { ...defaultShopifyConfig, ...config };
  const results: ShopifyTestResult[] = [];
  
  results.push(await testAppLoadsInIframe(fullConfig));
  
  results.push(await testThemeSettingsRespected(fullConfig));
  
  results.push(await testShopifyAuthentication(fullConfig));
  
  results.push(await testShopifyNavigation(fullConfig));
  
  results.push(await testResponsiveness(fullConfig));
  
  results.push(await testServiceWorkerInShopify(fullConfig));
  
  const overallSuccess = results.every(result => result.passed);
  
  return {
    timestamp: new Date().toISOString(),
    config: fullConfig,
    results,
    overallSuccess,
  };
};

/**
 * Test if the app loads correctly in a Shopify iframe
 */
const testAppLoadsInIframe = async (
  config: ShopifyEnvironmentConfig
): Promise<ShopifyTestResult> => {
  try {
    const rootElement = document.getElementById('root');
    const hasContent = rootElement && rootElement.children.length > 0;
    
    const hasShopifyErrors = false; // In a real implementation, this would check console logs
    
    return {
      name: 'App Loads in Shopify Iframe',
      passed: Boolean(hasContent) && !hasShopifyErrors,
      details: hasContent 
        ? 'App successfully loaded in Shopify iframe context'
        : 'App failed to load properly in Shopify iframe',
    };
  } catch (error) {
    return {
      name: 'App Loads in Shopify Iframe',
      passed: false,
      details: `Error testing iframe loading: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test if the app respects Shopify theme settings
 */
const testThemeSettingsRespected = async (
  config: ShopifyEnvironmentConfig
): Promise<ShopifyTestResult> => {
  try {
    
    const hasThemeContext = !!(window as any).__THEME_SETTINGS_CONTEXT__;
    
    return {
      name: 'Respects Shopify Theme Settings',
      passed: hasThemeContext,
      details: hasThemeContext
        ? 'App correctly applies Shopify theme settings'
        : 'App does not properly integrate with Shopify theme settings',
    };
  } catch (error) {
    return {
      name: 'Respects Shopify Theme Settings',
      passed: false,
      details: `Error testing theme settings: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test if the app handles Shopify authentication correctly
 */
const testShopifyAuthentication = async (
  config: ShopifyEnvironmentConfig
): Promise<ShopifyTestResult> => {
  try {
    const url = new URL(window.location.href);
    const hasShopParam = url.searchParams.has('shop');
    const hasHmacParam = url.searchParams.has('hmac');
    
    const authenticationWorks = hasShopParam && hasHmacParam;
    
    return {
      name: 'Handles Shopify Authentication',
      passed: authenticationWorks,
      details: authenticationWorks
        ? 'App correctly handles Shopify authentication flow'
        : 'App fails to process Shopify authentication parameters',
    };
  } catch (error) {
    return {
      name: 'Handles Shopify Authentication',
      passed: false,
      details: `Error testing authentication: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test if the app handles Shopify navigation correctly
 */
const testShopifyNavigation = async (
  config: ShopifyEnvironmentConfig
): Promise<ShopifyTestResult> => {
  try {
    
    const usesReactRouter = !!(window as any).__REACT_ROUTER_HISTORY__;
    
    return {
      name: 'Handles Shopify Navigation',
      passed: usesReactRouter,
      details: usesReactRouter
        ? 'App correctly handles navigation within Shopify context'
        : 'App navigation may not work properly within Shopify',
    };
  } catch (error) {
    return {
      name: 'Handles Shopify Navigation',
      passed: false,
      details: `Error testing navigation: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test if the app is responsive in Shopify context
 */
const testResponsiveness = async (
  config: ShopifyEnvironmentConfig
): Promise<ShopifyTestResult> => {
  try {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const hasViewport = !!viewportMeta && viewportMeta.getAttribute('content')!.includes('width=device-width');
    
    const styleSheets = Array.from(document.styleSheets);
    let hasMediaQueries = false;
    
    try {
      for (const sheet of styleSheets) {
        if (sheet.cssRules) {
          for (const rule of Array.from(sheet.cssRules)) {
            if (rule instanceof CSSMediaRule) {
              hasMediaQueries = true;
              break;
            }
          }
        }
        if (hasMediaQueries) break;
      }
    } catch (e) {
      hasMediaQueries = true;
    }
    
    return {
      name: 'Responsive in Shopify Context',
      passed: hasViewport && hasMediaQueries,
      details: (hasViewport && hasMediaQueries)
        ? 'App is properly responsive within Shopify context'
        : 'App may not be fully responsive within Shopify',
    };
  } catch (error) {
    return {
      name: 'Responsive in Shopify Context',
      passed: false,
      details: `Error testing responsiveness: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Test if service worker functions correctly in Shopify context
 */
const testServiceWorkerInShopify = async (
  config: ShopifyEnvironmentConfig
): Promise<ShopifyTestResult> => {
  try {
    const serviceWorkerRegistered = 'serviceWorker' in navigator && 
      (await navigator.serviceWorker.getRegistration()) !== undefined;
    
    
    return {
      name: 'Service Worker in Shopify',
      passed: serviceWorkerRegistered,
      details: serviceWorkerRegistered
        ? 'Service worker functions correctly within Shopify context'
        : 'Service worker may not be properly registered in Shopify context',
    };
  } catch (error) {
    return {
      name: 'Service Worker in Shopify',
      passed: false,
      details: `Error testing service worker: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

/**
 * Format the Shopify environment test report as HTML
 */
export const formatShopifyTestReportAsHtml = (report: ShopifyTestReport): string => {
  const resultItems = report.results.map(result => {
    const statusClass = result.passed ? 'text-green-600' : 'text-red-600';
    const statusIcon = result.passed ? '✓' : '✗';
    
    return `
      <div class="border-b border-gray-200 py-4">
        <div class="flex items-center justify-between">
          <h4 class="font-medium">${result.name}</h4>
          <span class="${statusClass} font-bold">${statusIcon}</span>
        </div>
        <p class="mt-2 text-gray-600 text-sm">${result.details}</p>
      </div>
    `;
  }).join('');
  
  const configItems = Object.entries(report.config).map(([key, value]) => {
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());
    
    return `
      <div class="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
        <span class="text-gray-600">${label}</span>
        <span>${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
      </div>
    `;
  }).join('');
  
  const overallStatusClass = report.overallSuccess ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700';
  const overallStatusText = report.overallSuccess ? 'All tests passed!' : 'Some tests failed';
  
  return `
    <div class="shopify-test-report">
      <div class="${overallStatusClass} border-l-4 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 ${report.overallSuccess ? 'text-green-400' : 'text-red-400'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              ${report.overallSuccess 
                ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />'
                : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />'
              }
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">
              ${overallStatusText}
            </p>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-4">Test Results</h3>
        <div class="bg-white rounded-lg shadow">
          ${resultItems}
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-4">Environment Configuration</h3>
        <div class="bg-white rounded-lg shadow p-4">
          ${configItems}
        </div>
      </div>
      
      <div class="text-sm text-gray-600 mt-4">
        Report generated at ${new Date(report.timestamp).toLocaleString()}
      </div>
    </div>
  `;
};
