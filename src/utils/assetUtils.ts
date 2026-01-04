export const getAssetUrl = (path: string) => {
  // 1. Check if it's a pre-defined game asset (e.g. "logoGold", "cardLabor")
  // @ts-ignore
  if (window.pwaThemeVariables?.gameAssets && window.pwaThemeVariables.gameAssets[path]) {
    // @ts-ignore
    return window.pwaThemeVariables.gameAssets[path];
  }

  const filename = path.split('/').pop();

  // 2. Fallback to constructing URL from base assetsUrl
  // @ts-ignore
  if (window.pwaThemeVariables && window.pwaThemeVariables.assetsUrl) {
    // @ts-ignore
    return window.pwaThemeVariables.assetsUrl + filename;
  }

  // @ts-ignore
  if (window.shopifyCdnPath) {
    // @ts-ignore
    return window.shopifyCdnPath + filename;
  }

  // 3. Last Resort
  console.warn(`getAssetUrl: Asset not found for [${path}], falling back to raw path.`);
  return path;
};
