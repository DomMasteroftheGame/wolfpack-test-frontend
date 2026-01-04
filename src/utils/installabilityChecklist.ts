/**
 * PWA Installability Checklist
 * 
 * This file contains utility functions to verify that the app meets all
 * installability criteria required for a Progressive Web App.
 */

export const checkWebManifest = (): boolean => {
  const manifestLink = document.querySelector('link[rel="manifest"]');
  return !!manifestLink;
};

export const checkServiceWorker = async (): Promise<boolean> => {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.length > 0;
  } catch (error) {
    console.error('Error checking service worker:', error);
    return false;
  }
};

export const checkIcons = (): boolean => {
  const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
  
  const favicon = document.querySelector('link[rel="icon"]');
  
  return !!appleIcon && !!favicon;
};

export const checkMetaTags = (): boolean => {
  const themeColor = document.querySelector('meta[name="theme-color"]');
  
  const description = document.querySelector('meta[name="description"]');
  
  const viewport = document.querySelector('meta[name="viewport"]');
  
  const appleMobileWebAppCapable = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
  
  return !!themeColor && !!description && !!viewport && !!appleMobileWebAppCapable;
};

export const checkHttps = (): boolean => {
  return window.location.protocol === 'https:';
};

export const checkResponsive = (): boolean => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    return false;
  }
  
  const content = viewport.getAttribute('content') || '';
  return content.includes('width=device-width') && content.includes('initial-scale=1');
};

export const runInstallabilityChecks = async (): Promise<{
  passed: boolean;
  checks: Record<string, boolean>;
}> => {
  const checks = {
    webManifest: checkWebManifest(),
    icons: checkIcons(),
    metaTags: checkMetaTags(),
    https: checkHttps(),
    responsive: checkResponsive(),
    serviceWorker: await checkServiceWorker(),
  };
  
  const passed = Object.values(checks).every(Boolean);
  
  return {
    passed,
    checks,
  };
};

export const logInstallabilityReport = async (): Promise<void> => {
  const report = await runInstallabilityChecks();
  
  console.group('PWA Installability Report');
  console.log(`Overall: ${report.passed ? '✅ PASSED' : '❌ FAILED'}`);
  
  Object.entries(report.checks).forEach(([check, passed]) => {
    console.log(`${check}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
  });
  
  console.groupEnd();
  
  if (!report.passed) {
    console.warn('The app does not meet all installability criteria. Check the report for details.');
  } else {
    console.info('The app meets all installability criteria! It should be installable on supported devices.');
  }
};

const isDev = window.location.hostname === 'localhost' || 
              window.location.hostname === '127.0.0.1' ||
              window.location.hostname.includes('dev') ||
              window.location.hostname.includes('staging');

if (isDev) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      logInstallabilityReport();
    }, 2000); // Wait for service worker to register
  });
}
