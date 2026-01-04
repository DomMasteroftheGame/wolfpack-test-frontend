/**
 * Device Testing Utilities
 * 
 * This file contains utilities for testing the PWA on different devices and screen sizes.
 */

export interface DeviceProfile {
  name: string;
  width: number;
  height: number;
  userAgent: string;
  devicePixelRatio: number;
  touch: boolean;
  orientation: 'portrait' | 'landscape';
  capabilities: {
    pwa: boolean;
    webp: boolean;
    webgl: boolean;
    webgl2: boolean;
    serviceWorker: boolean;
    indexedDB: boolean;
    webStorage: boolean;
    webRTC: boolean;
    geolocation: boolean;
    notifications: boolean;
    bluetooth: boolean;
    nfc: boolean;
  };
}

export const deviceProfiles: Record<string, DeviceProfile> = {
  'iPhone SE': {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    devicePixelRatio: 2,
    touch: true,
    orientation: 'portrait',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: false,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: false,
    },
  },
  'iPhone 13': {
    name: 'iPhone 13',
    width: 390,
    height: 844,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    devicePixelRatio: 3,
    touch: true,
    orientation: 'portrait',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: false,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: true,
    },
  },
  'Samsung Galaxy S21': {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Mobile Safari/537.36',
    devicePixelRatio: 3,
    touch: true,
    orientation: 'portrait',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: true,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: true,
    },
  },
  'Google Pixel 6': {
    name: 'Google Pixel 6',
    width: 393,
    height: 851,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Mobile Safari/537.36',
    devicePixelRatio: 2.75,
    touch: true,
    orientation: 'portrait',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: true,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: true,
    },
  },
  
  'iPad (9th generation)': {
    name: 'iPad (9th generation)',
    width: 810,
    height: 1080,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    devicePixelRatio: 2,
    touch: true,
    orientation: 'portrait',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: false,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: false,
    },
  },
  'Samsung Galaxy Tab S7': {
    name: 'Samsung Galaxy Tab S7',
    width: 1600,
    height: 2560,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36',
    devicePixelRatio: 2,
    touch: true,
    orientation: 'landscape',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: true,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: true,
    },
  },
  
  'Desktop Chrome': {
    name: 'Desktop Chrome',
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36',
    devicePixelRatio: 1,
    touch: false,
    orientation: 'landscape',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: true,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: false,
    },
  },
  'Desktop Safari': {
    name: 'Desktop Safari',
    width: 1440,
    height: 900,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Safari/605.1.15',
    devicePixelRatio: 2,
    touch: false,
    orientation: 'landscape',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: false,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: false,
    },
  },
  'Desktop Firefox': {
    name: 'Desktop Firefox',
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0',
    devicePixelRatio: 1,
    touch: false,
    orientation: 'landscape',
    capabilities: {
      pwa: true,
      webp: true,
      webgl: true,
      webgl2: true,
      serviceWorker: true,
      indexedDB: true,
      webStorage: true,
      webRTC: true,
      geolocation: true,
      notifications: true,
      bluetooth: true,
      nfc: false,
    },
  },
};

/**
 * Simulate a device by applying its profile to the current window
 * @param deviceName Name of the device to simulate
 * @returns The applied device profile or null if not found
 */
export const simulateDevice = (deviceName: string): DeviceProfile | null => {
  const profile = deviceProfiles[deviceName];
  if (!profile) {
    console.error(`Device profile not found: ${deviceName}`);
    return null;
  }

  console.log(`Simulating device: ${profile.name}`);
  console.log(`- Resolution: ${profile.width}x${profile.height}`);
  console.log(`- User Agent: ${profile.userAgent}`);
  console.log(`- Touch: ${profile.touch ? 'Yes' : 'No'}`);
  console.log(`- Orientation: ${profile.orientation}`);

  return profile;
};

/**
 * Check if the current browser supports all required PWA features
 * @returns Object containing support status for each feature
 */
export const checkPWASupport = (): Record<string, boolean> => {
  return {
    serviceWorker: 'serviceWorker' in navigator,
    caches: 'caches' in window,
    pushManager: 'PushManager' in window,
    indexedDB: 'indexedDB' in window,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window,
    webManifest: !!document.querySelector('link[rel="manifest"]'),
    installPrompt: true, // This can't be detected directly
    offlineCapability: true, // This can't be detected directly
  };
};

/**
 * Get a report of PWA compatibility for the current browser
 * @returns HTML string with compatibility report
 */
export const getPWACompatibilityReport = (): string => {
  const support = checkPWASupport();
  const totalFeatures = Object.keys(support).length;
  const supportedFeatures = Object.values(support).filter(Boolean).length;
  const compatibilityScore = Math.round((supportedFeatures / totalFeatures) * 100);

  let report = `<h2>PWA Compatibility: ${compatibilityScore}%</h2>`;
  report += '<ul>';
  
  for (const [feature, supported] of Object.entries(support)) {
    const icon = supported ? '✅' : '❌';
    const featureName = feature
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
    
    report += `<li>${icon} ${featureName}</li>`;
  }
  
  report += '</ul>';
  
  return report;
};
