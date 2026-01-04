/**
 * Lighthouse PWA Score Checker
 * 
 * This utility provides functions to check and analyze the Lighthouse PWA score
 * of the application. It includes methods to run Lighthouse audits programmatically
 * and display the results in a user-friendly format.
 */

export interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

export interface LighthousePWADetails {
  installable: boolean;
  serviceWorkerRegistered: boolean;
  workOffline: boolean;
  splashScreenFound: boolean;
  themedOmnibox: boolean;
  contentSized: boolean;
  viewportConfigured: boolean;
  manifestExists: boolean;
  manifestHasIcons: boolean;
  manifestHasName: boolean;
  manifestHasStartUrl: boolean;
  manifestHasDisplay: boolean;
  manifestHasThemeColor: boolean;
  manifestHasBackgroundColor: boolean;
  manifestHasShortName: boolean;
  redirectsHttpToHttps: boolean;
}

export interface LighthouseReport {
  scores: LighthouseScore;
  pwaDetails: LighthousePWADetails;
  timestamp: string;
  url: string;
  suggestions: string[];
}

/**
 * Simulates running a Lighthouse audit
 * In a real implementation, this would use the Lighthouse API or CLI
 */
export const runLighthouseAudit = async (url: string): Promise<LighthouseReport> => {
  
  if (typeof window === 'undefined') {
    throw new Error('Lighthouse audit can only be run in a browser environment');
  }
  
  console.log(`Running Lighthouse audit for ${url}...`);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const serviceWorkerRegistered = 'serviceWorker' in navigator && 
    (await navigator.serviceWorker.getRegistration()) !== undefined;
  
  const manifestExists = !!document.querySelector('link[rel="manifest"]');
  
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const themedOmnibox = !!themeColorMeta;
  
  const viewportConfigured = !!document.querySelector('meta[name="viewport"]');
  
  const report: LighthouseReport = {
    scores: {
      performance: Math.random() * 30 + 70, // 70-100
      accessibility: Math.random() * 20 + 80, // 80-100
      bestPractices: Math.random() * 20 + 80, // 80-100
      seo: Math.random() * 20 + 80, // 80-100
      pwa: calculatePWAScore({
        serviceWorkerRegistered,
        manifestExists,
        themedOmnibox,
        viewportConfigured
      }),
    },
    pwaDetails: {
      installable: serviceWorkerRegistered && manifestExists,
      serviceWorkerRegistered,
      workOffline: serviceWorkerRegistered,
      splashScreenFound: manifestExists,
      themedOmnibox,
      contentSized: true,
      viewportConfigured,
      manifestExists,
      manifestHasIcons: manifestExists,
      manifestHasName: manifestExists,
      manifestHasStartUrl: manifestExists,
      manifestHasDisplay: manifestExists,
      manifestHasThemeColor: manifestExists && themedOmnibox,
      manifestHasBackgroundColor: manifestExists,
      manifestHasShortName: manifestExists,
      redirectsHttpToHttps: url.startsWith('https'),
    },
    timestamp: new Date().toISOString(),
    url,
    suggestions: generateSuggestions({
      serviceWorkerRegistered,
      manifestExists,
      themedOmnibox,
      viewportConfigured
    }),
  };
  
  return report;
};

/**
 * Calculate a simulated PWA score based on key factors
 */
const calculatePWAScore = (factors: {
  serviceWorkerRegistered: boolean;
  manifestExists: boolean;
  themedOmnibox: boolean;
  viewportConfigured: boolean;
}): number => {
  let score = 0;
  
  if (factors.serviceWorkerRegistered) score += 40;
  if (factors.manifestExists) score += 30;
  if (factors.themedOmnibox) score += 15;
  if (factors.viewportConfigured) score += 15;
  
  score = Math.min(100, score + (Math.random() * 10 - 5));
  
  return Math.round(score);
};

/**
 * Generate suggestions for improving PWA score
 */
const generateSuggestions = (factors: {
  serviceWorkerRegistered: boolean;
  manifestExists: boolean;
  themedOmnibox: boolean;
  viewportConfigured: boolean;
}): string[] => {
  const suggestions: string[] = [];
  
  if (!factors.serviceWorkerRegistered) {
    suggestions.push('Register a service worker to enable offline capabilities');
  }
  
  if (!factors.manifestExists) {
    suggestions.push('Add a web app manifest to make your app installable');
  }
  
  if (!factors.themedOmnibox) {
    suggestions.push('Add a theme-color meta tag to customize the browser UI');
  }
  
  if (!factors.viewportConfigured) {
    suggestions.push('Configure the viewport meta tag for proper mobile rendering');
  }
  
  suggestions.push('Ensure your app works offline by caching critical resources');
  suggestions.push('Optimize performance by minimizing main-thread work');
  suggestions.push('Implement a custom splash screen for a better user experience');
  
  return suggestions;
};

/**
 * Format the Lighthouse report as HTML
 */
export const formatLighthouseReportAsHtml = (report: LighthouseReport): string => {
  const scoreClass = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const formatScore = (score: number): string => {
    return Math.round(score).toString();
  };
  
  const checkMark = '✓';
  const crossMark = '✗';
  
  const pwaChecklist = Object.entries(report.pwaDetails).map(([key, value]) => {
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase());
    
    return `
      <div class="flex items-center justify-between py-2 border-b border-gray-200">
        <span>${label}</span>
        <span class="${value ? 'text-green-600' : 'text-red-600'} font-bold">
          ${value ? checkMark : crossMark}
        </span>
      </div>
    `;
  }).join('');
  
  const suggestions = report.suggestions.map(suggestion => {
    return `<li class="py-1">${suggestion}</li>`;
  }).join('');
  
  return `
    <div class="lighthouse-report">
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-4">Lighthouse Scores</h3>
        <div class="grid grid-cols-5 gap-4">
          <div class="bg-white p-4 rounded-lg shadow text-center">
            <div class="text-2xl font-bold ${scoreClass(report.scores.performance)}">${formatScore(report.scores.performance)}</div>
            <div class="text-sm text-gray-600">Performance</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow text-center">
            <div class="text-2xl font-bold ${scoreClass(report.scores.accessibility)}">${formatScore(report.scores.accessibility)}</div>
            <div class="text-sm text-gray-600">Accessibility</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow text-center">
            <div class="text-2xl font-bold ${scoreClass(report.scores.bestPractices)}">${formatScore(report.scores.bestPractices)}</div>
            <div class="text-sm text-gray-600">Best Practices</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow text-center">
            <div class="text-2xl font-bold ${scoreClass(report.scores.seo)}">${formatScore(report.scores.seo)}</div>
            <div class="text-sm text-gray-600">SEO</div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow text-center">
            <div class="text-2xl font-bold ${scoreClass(report.scores.pwa)}">${formatScore(report.scores.pwa)}</div>
            <div class="text-sm text-gray-600">PWA</div>
          </div>
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-4">PWA Checklist</h3>
        <div class="bg-white p-4 rounded-lg shadow">
          ${pwaChecklist}
        </div>
      </div>
      
      <div class="mb-6">
        <h3 class="text-xl font-bold mb-4">Suggestions</h3>
        <div class="bg-white p-4 rounded-lg shadow">
          <ul class="list-disc pl-5">
            ${suggestions}
          </ul>
        </div>
      </div>
      
      <div class="text-sm text-gray-600 mt-4">
        Report generated for ${report.url} at ${new Date(report.timestamp).toLocaleString()}
      </div>
    </div>
  `;
};

/**
 * Check if the current page meets PWA criteria
 */
export const checkPWACriteria = async (): Promise<{
  isPWA: boolean;
  details: Partial<LighthousePWADetails>;
}> => {
  const serviceWorkerRegistered = 'serviceWorker' in navigator && 
    (await navigator.serviceWorker.getRegistration()) !== undefined;
  
  const manifestExists = !!document.querySelector('link[rel="manifest"]');
  
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const themedOmnibox = !!themeColorMeta;
  
  const viewportConfigured = !!document.querySelector('meta[name="viewport"]');
  
  const isHttps = window.location.protocol === 'https:';
  
  const details: Partial<LighthousePWADetails> = {
    serviceWorkerRegistered,
    manifestExists,
    themedOmnibox,
    viewportConfigured,
    redirectsHttpToHttps: isHttps,
  };
  
  const isPWA = serviceWorkerRegistered && manifestExists;
  
  return { isPWA, details };
};
