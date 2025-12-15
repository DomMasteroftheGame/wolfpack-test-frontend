// frontend/src/utils/assets.ts

// Define the window interface extension locally if not already defined globally
declare global {
  interface Window {
    pwaThemeVariables?: {
      assetsUrl?: string;
      [key: string]: any;
    };
  }
}

export const getAssetUrl = (path: string) => {
  // 1. Check for the Liquid Injection Variable
  if (window.pwaThemeVariables && window.pwaThemeVariables.assetsUrl) {
     // Ensure we don't have double slashes or subdirectories
     // Shopify assets are all flat in the assets/ folder
     const filename = path.split('/').pop(); 
     return `${window.pwaThemeVariables.assetsUrl}${filename}`;
  }
  // 2. Fallback for Localhost (Vite)
  // In local dev, we might need the full path if it's in public/
  return path;
};
