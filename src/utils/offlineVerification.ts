/**
 * Offline Verification Utilities
 * 
 * This file contains utilities for verifying offline functionality of the PWA.
 */

export interface OfflineTestResult {
  name: string;
  passed: boolean;
  details: string;
  timestamp: number;
}

export interface OfflineVerificationReport {
  overallStatus: 'passed' | 'failed' | 'partial';
  results: OfflineTestResult[];
  timestamp: number;
  userAgent: string;
  networkInfo?: {
    downlink: number;
    effectiveType: string;
    rtt: number;
    saveData: boolean;
  };
}

/**
 * Simulates offline conditions by disabling network requests
 * @returns A function to restore network connectivity
 */
export const simulateOffline = (): (() => void) => {
  const originalFetch = window.fetch;
  const originalXHR = window.XMLHttpRequest;

  window.fetch = async () => {
    throw new Error('Network request failed - Simulated offline mode');
  };

  const OriginalXMLHttpRequestConstructor = window.XMLHttpRequest;
  
  window.XMLHttpRequest = function(this: XMLHttpRequest) {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    
    xhr.open = function(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
      originalOpen.call(xhr, method, url, async, username || null, password || null);
      
      const originalSend = xhr.send;
      xhr.send = function() {
        setTimeout(() => {
          xhr.dispatchEvent(new Event('error'));
          if (xhr.onerror) {
            const progressEvent = new ProgressEvent('error', {
              lengthComputable: false,
              loaded: 0,
              total: 0
            });
            xhr.onerror(progressEvent);
          }
        }, 100);
      };
      
      return xhr;
    };
    
    return xhr;
  } as unknown as typeof XMLHttpRequest;
  
  window.XMLHttpRequest.prototype = OriginalXMLHttpRequestConstructor.prototype;
  

  return () => {
    window.fetch = originalFetch;
    window.XMLHttpRequest = originalXHR;
  };
};

/**
 * Checks if the service worker is registered and active
 * @returns Promise resolving to a test result
 */
export const checkServiceWorkerStatus = async (): Promise<OfflineTestResult> => {
  try {
    if (!('serviceWorker' in navigator)) {
      return {
        name: 'Service Worker Support',
        passed: false,
        details: 'Service Workers are not supported in this browser',
        timestamp: Date.now()
      };
    }

    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      return {
        name: 'Service Worker Registration',
        passed: false,
        details: 'Service Worker is not registered',
        timestamp: Date.now()
      };
    }

    return {
      name: 'Service Worker Registration',
      passed: true,
      details: `Service Worker is registered and ${registration.active ? 'active' : 'pending'}`,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      name: 'Service Worker Registration',
      passed: false,
      details: `Error checking Service Worker: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    };
  }
};

/**
 * Checks if the cache storage is available and contains expected caches
 * @returns Promise resolving to a test result
 */
export const checkCacheStorage = async (): Promise<OfflineTestResult> => {
  try {
    if (!('caches' in window)) {
      return {
        name: 'Cache Storage',
        passed: false,
        details: 'Cache Storage API is not supported in this browser',
        timestamp: Date.now()
      };
    }

    const cacheNames = await window.caches.keys();
    
    if (cacheNames.length === 0) {
      return {
        name: 'Cache Storage',
        passed: false,
        details: 'No caches found. The app may not work offline.',
        timestamp: Date.now()
      };
    }

    return {
      name: 'Cache Storage',
      passed: true,
      details: `Found ${cacheNames.length} caches: ${cacheNames.join(', ')}`,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      name: 'Cache Storage',
      passed: false,
      details: `Error checking Cache Storage: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    };
  }
};

/**
 * Tests if critical assets are cached for offline use
 * @param assets Array of critical asset URLs to check
 * @returns Promise resolving to a test result
 */
export const checkCriticalAssetsCached = async (assets: string[]): Promise<OfflineTestResult> => {
  try {
    if (!('caches' in window)) {
      return {
        name: 'Critical Assets Cached',
        passed: false,
        details: 'Cache Storage API is not supported in this browser',
        timestamp: Date.now()
      };
    }

    const cacheNames = await window.caches.keys();
    let cachedAssets: string[] = [];
    let missingAssets: string[] = [];

    for (const cacheName of cacheNames) {
      const cache = await window.caches.open(cacheName);
      const requests = await cache.keys();
      const urls = requests.map(request => request.url);
      
      for (const asset of assets) {
        const assetUrl = new URL(asset, window.location.origin).href;
        if (urls.some(url => url.includes(assetUrl) || assetUrl.includes(url))) {
          cachedAssets.push(asset);
        }
      }
    }

    missingAssets = assets.filter(asset => !cachedAssets.includes(asset));

    if (missingAssets.length > 0) {
      return {
        name: 'Critical Assets Cached',
        passed: false,
        details: `Missing ${missingAssets.length} critical assets: ${missingAssets.join(', ')}`,
        timestamp: Date.now()
      };
    }

    return {
      name: 'Critical Assets Cached',
      passed: true,
      details: `All ${assets.length} critical assets are cached`,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      name: 'Critical Assets Cached',
      passed: false,
      details: `Error checking cached assets: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    };
  }
};

/**
 * Tests if IndexedDB is available and working
 * @returns Promise resolving to a test result
 */
export const checkIndexedDB = async (): Promise<OfflineTestResult> => {
  try {
    if (!('indexedDB' in window)) {
      return {
        name: 'IndexedDB Support',
        passed: false,
        details: 'IndexedDB is not supported in this browser',
        timestamp: Date.now()
      };
    }

    const request = indexedDB.open('offline-test-db', 1);
    
    return new Promise((resolve) => {
      request.onerror = () => {
        resolve({
          name: 'IndexedDB Support',
          passed: false,
          details: 'Error opening IndexedDB database',
          timestamp: Date.now()
        });
      };
      
      request.onsuccess = () => {
        const db = request.result;
        db.close();
        
        indexedDB.deleteDatabase('offline-test-db');
        
        resolve({
          name: 'IndexedDB Support',
          passed: true,
          details: 'IndexedDB is available and working',
          timestamp: Date.now()
        });
      };
    });
  } catch (error) {
    return {
      name: 'IndexedDB Support',
      passed: false,
      details: `Error testing IndexedDB: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    };
  }
};

/**
 * Tests if localStorage is available and working
 * @returns A test result
 */
export const checkLocalStorage = (): OfflineTestResult => {
  try {
    if (!('localStorage' in window)) {
      return {
        name: 'Local Storage Support',
        passed: false,
        details: 'Local Storage is not supported in this browser',
        timestamp: Date.now()
      };
    }

    const testKey = 'offline-test-key';
    const testValue = 'offline-test-value';
    
    localStorage.setItem(testKey, testValue);
    const retrievedValue = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrievedValue !== testValue) {
      return {
        name: 'Local Storage Support',
        passed: false,
        details: 'Local Storage is not working correctly',
        timestamp: Date.now()
      };
    }

    return {
      name: 'Local Storage Support',
      passed: true,
      details: 'Local Storage is available and working',
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      name: 'Local Storage Support',
      passed: false,
      details: `Error testing Local Storage: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    };
  }
};

/**
 * Tests offline navigation by simulating offline conditions and attempting to navigate
 * @param routes Array of routes to test
 * @returns Promise resolving to a test result
 */
export const testOfflineNavigation = async (routes: string[]): Promise<OfflineTestResult> => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  try {
    let successfulRoutes: string[] = [];
    let failedRoutes: string[] = [];
    
    for (const route of routes) {
      try {
        const url = new URL(route, window.location.origin).href;
        iframe.src = url;
        
        await new Promise<void>((resolve) => {
          iframe.onload = () => resolve();
          iframe.onerror = () => resolve();
          setTimeout(resolve, 3000); // Timeout after 3 seconds
        });
        
        if (iframe.contentDocument && iframe.contentDocument.body) {
          successfulRoutes.push(route);
        } else {
          failedRoutes.push(route);
        }
      } catch (error) {
        failedRoutes.push(route);
      }
    }
    
    if (failedRoutes.length > 0) {
      return {
        name: 'Offline Navigation',
        passed: false,
        details: `Failed to navigate to ${failedRoutes.length} routes: ${failedRoutes.join(', ')}`,
        timestamp: Date.now()
      };
    }
    
    return {
      name: 'Offline Navigation',
      passed: true,
      details: `Successfully navigated to all ${routes.length} routes while offline`,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      name: 'Offline Navigation',
      passed: false,
      details: `Error testing offline navigation: ${error instanceof Error ? error.message : String(error)}`,
      timestamp: Date.now()
    };
  } finally {
    document.body.removeChild(iframe);
  }
};

/**
 * Runs all offline verification tests
 * @returns Promise resolving to a verification report
 */
export const runAllOfflineTests = async (): Promise<OfflineVerificationReport> => {
  const results: OfflineTestResult[] = [];
  
  results.push(await checkServiceWorkerStatus());
  results.push(await checkCacheStorage());
  results.push(await checkCriticalAssetsCached([
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/images/logo.png'
  ]));
  results.push(await checkIndexedDB());
  results.push(checkLocalStorage());
  results.push(await testOfflineNavigation([
    '/',
    '/offline',
    '/dashboard'
  ]));
  
  const passedTests = results.filter(result => result.passed).length;
  const totalTests = results.length;
  let overallStatus: 'passed' | 'failed' | 'partial' = 'failed';
  
  if (passedTests === totalTests) {
    overallStatus = 'passed';
  } else if (passedTests > 0) {
    overallStatus = 'partial';
  }
  
  let networkInfo;
  if ('connection' in navigator && navigator.connection) {
    const connection = navigator.connection as any;
    networkInfo = {
      downlink: connection.downlink,
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  }
  
  return {
    overallStatus,
    results,
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    networkInfo
  };
};

/**
 * Generates an HTML report from verification results
 * @param report The verification report
 * @returns HTML string with formatted report
 */
export const generateOfflineVerificationReport = (report: OfflineVerificationReport): string => {
  const statusColors = {
    passed: 'text-green-600',
    failed: 'text-red-600',
    partial: 'text-yellow-600'
  };
  
  const statusIcons = {
    passed: '✅',
    failed: '❌',
    partial: '⚠️'
  };
  
  const date = new Date(report.timestamp).toLocaleString();
  
  let html = `
    <div class="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">Offline Verification Report</h2>
        <div class="flex items-center">
          <span class="${statusColors[report.overallStatus]} text-xl mr-2">${statusIcons[report.overallStatus]}</span>
          <span class="font-semibold ${statusColors[report.overallStatus]}">
            ${report.overallStatus.charAt(0).toUpperCase() + report.overallStatus.slice(1)}
          </span>
        </div>
      </div>
      
      <div class="mb-6 text-sm text-gray-600">
        <p>Generated on: ${date}</p>
        <p>Browser: ${report.userAgent}</p>
        ${report.networkInfo ? `
          <p>Network: ${report.networkInfo.effectiveType} 
             (${report.networkInfo.downlink}Mbps, RTT: ${report.networkInfo.rtt}ms)
             ${report.networkInfo.saveData ? '(Data Saver enabled)' : ''}
          </p>
        ` : ''}
      </div>
      
      <div class="space-y-4">
  `;
  
  for (const result of report.results) {
    const resultDate = new Date(result.timestamp).toLocaleString();
    const resultIcon = result.passed ? '✅' : '❌';
    const resultColor = result.passed ? 'text-green-600' : 'text-red-600';
    
    html += `
      <div class="border rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold">${result.name}</h3>
          <span class="${resultColor}">${resultIcon}</span>
        </div>
        <p class="text-gray-700 mb-2">${result.details}</p>
        <p class="text-xs text-gray-500">Tested at: ${resultDate}</p>
      </div>
    `;
  }
  
  html += `
      </div>
      
      <div class="mt-6 pt-4 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Passed ${report.results.filter(r => r.passed).length} of ${report.results.length} tests
        </p>
      </div>
    </div>
  `;
  
  return html;
};
