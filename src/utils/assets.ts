export const getAssetUrl = (path: string) => {
  // 1. Try to get CDN URL from Liquid Injection
  if ((window as any).pwaThemeVariables && (window as any).pwaThemeVariables.gameAssets) {
     const assets = (window as any).pwaThemeVariables.gameAssets;
     if (path.includes('labor')) return assets.cardLabor;
     if (path.includes('finance')) return assets.cardFinance;
     if (path.includes('sales')) return assets.cardSales;
     if (path.includes('logo')) return assets.logoGold;
  }

  // 2. Fallback to a safe placeholder if theme injection fails
  // Using a generic placeholder or the logo if available in the path
  if (path.includes('logo')) return "/wolfpack-logo.png";
  
  // Return a placeholder service URL for cards to avoid broken images
  return `https://placehold.co/400x600/111/FFD700?text=${path.replace('card_', '').toUpperCase()}`;
};
