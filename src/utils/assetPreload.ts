/**
 * Asset Preloading Utilities
 * 
 * This file contains utilities for preloading critical assets in the PWA application.
 */

import { preloadCriticalImages } from './imageOptimization';

declare global {
  interface Window {
    shopifyCdnPath?: string;
  }
}

// Helper to get asset URL
const getAssetUrl = (path: string) => {
  if (window.shopifyCdnPath) {
    // Remove /assets/ prefix if present as shopifyCdnPath usually includes the base path
    const fileName = path.split('/').pop();
    return `${window.shopifyCdnPath}${fileName}`;
  }
  return path;
};

const criticalCssFiles = [
  getAssetUrl('game-app-styles.css'),
];

const criticalJsFiles = [
  getAssetUrl('game-app-bundle-v13.js'),
];

const criticalImages = [
  getAssetUrl('wolfpack-logo.png'),
  getAssetUrl('icon-192x192.png'),
];

const criticalFonts = [
  getAssetUrl('montserrat-bold.woff2'),
  getAssetUrl('montserrat-regular.woff2'),
];

/**
 * Preload critical CSS files
 */
export const preloadCriticalCss = (): void => {
  criticalCssFiles.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = file;
    document.head.appendChild(link);
  });
};

/**
 * Preload critical JavaScript files
 */
export const preloadCriticalJs = (): void => {
  criticalJsFiles.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = file;
    document.head.appendChild(link);
  });
};

/**
 * Preload critical fonts
 */
export const preloadCriticalFonts = (): void => {
  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = font;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Initialize asset preloading
 */
export const initAssetPreloading = (): void => {
  preloadCriticalImages(criticalImages);

  preloadCriticalCss();

  preloadCriticalJs();

  preloadCriticalFonts();
};

/**
 * Preload assets for a specific route
 * @param route The route to preload assets for
 */
export const preloadRouteAssets = (route: string): void => {
  const routeAssets: Record<string, string[]> = {
    '/dashboard': [
      getAssetUrl('/assets/images/dashboard-bg.webp'),
    ],
    '/gameboard': [
      getAssetUrl('/assets/images/gameboard-bg.webp'),
    ],
    '/leaderboard': [
      getAssetUrl('/assets/images/leaderboard-bg.webp'),
    ],
  };

  if (routeAssets[route]) {
    preloadCriticalImages(routeAssets[route]);
  }
};
