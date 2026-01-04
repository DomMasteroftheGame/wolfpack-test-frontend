/**
 * Image Optimization Utilities
 * 
 * This file contains utilities for optimizing images in the PWA application.
 */

export const imageSizes = {
  thumbnail: 80,
  small: 240,
  medium: 480,
  large: 800,
  original: 'original'
};

export const optimizedImageMap: Record<string, Record<string | number, string>> = {
  '/assets/images/wolfpack-logo.png': {
    [imageSizes.thumbnail]: '/assets/images/optimized/wolfpack-logo-80.webp',
    [imageSizes.small]: '/assets/images/optimized/wolfpack-logo-240.webp',
    [imageSizes.medium]: '/assets/images/optimized/wolfpack-logo-480.webp',
    [imageSizes.large]: '/assets/images/optimized/wolfpack-logo-800.webp',
    [imageSizes.original]: '/assets/images/wolfpack-logo.png'
  },
  '/assets/icons/icon-192x192.png': {
    [imageSizes.thumbnail]: '/assets/icons/optimized/icon-80.webp',
    [imageSizes.small]: '/assets/icons/optimized/icon-192.webp',
    [imageSizes.original]: '/assets/icons/icon-192x192.png'
  },
  '/assets/icons/icon-512x512.png': {
    [imageSizes.small]: '/assets/icons/optimized/icon-240.webp',
    [imageSizes.medium]: '/assets/icons/optimized/icon-480.webp',
    [imageSizes.large]: '/assets/icons/optimized/icon-512.webp',
    [imageSizes.original]: '/assets/icons/icon-512x512.png'
  }
};

/**
 * Get the optimized image URL for a given image path and size
 * @param imagePath Original image path
 * @param size Desired image size
 * @returns Optimized image URL or original if no optimized version exists
 */
export const getOptimizedImageUrl = (
  imagePath: string, 
  size: number | 'original' = 'original'
): string => {
  if (!optimizedImageMap[imagePath]) {
    return imagePath;
  }

  if (size !== 'original' && !optimizedImageMap[imagePath][size]) {
    const availableSizes = Object.keys(optimizedImageMap[imagePath])
      .filter(s => s !== 'original')
      .map(s => parseInt(s, 10))
      .filter(s => !isNaN(s))
      .sort((a, b) => a - b);
    
    const closestSize = availableSizes.find(s => s >= size) || availableSizes[availableSizes.length - 1] || 'original';
    return optimizedImageMap[imagePath][closestSize] || imagePath;
  }

  return optimizedImageMap[imagePath][size] || imagePath;
};

/**
 * Generate srcset attribute for responsive images
 * @param imagePath Original image path
 * @returns srcset string for use in img elements
 */
export const generateSrcSet = (imagePath: string): string => {
  if (!optimizedImageMap[imagePath]) {
    return '';
  }

  const srcSetEntries = Object.entries(optimizedImageMap[imagePath])
    .filter(([size]) => size !== 'original')
    .map(([size, url]) => `${url} ${size}w`);
  
  return srcSetEntries.join(', ');
};

/**
 * Check if the browser supports WebP format
 * @returns Promise that resolves to true if WebP is supported
 */
export const supportsWebP = async (): Promise<boolean> => {
  if (!self.createImageBitmap) return false;

  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * Get the appropriate image format based on browser support
 * @returns 'webp' if supported, otherwise 'png'
 */
export const getOptimalImageFormat = async (): Promise<'webp' | 'png'> => {
  return (await supportsWebP()) ? 'webp' : 'png';
};

/**
 * Preload critical images
 * @param imagePaths Array of image paths to preload
 */
export const preloadCriticalImages = (imagePaths: string[]): void => {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
};
